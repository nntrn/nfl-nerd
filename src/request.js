const fetch = require('node-fetch')
const path = require('path')

const {
  createAndWrite,
  loadJSON,
  existsSync,
  isFunction,
  dataCleanup,
} = require('./utils')

class Request {
  constructor(name = 'request') {
    this.name = name
    this.outDir = '__data__'
  }

  setName(name) {
    this.name = name
    return this
  }

  resolveCachePath(filePath) {
    return path.resolve(path.join(process.cwd(), this.outDir, this.name), filePath)
  }

  async getData(url, localFile, cb) {
    const localPath = this.resolveCachePath(localFile)
    return new Promise((resolve, reject) => {
      if(localFile && existsSync(localPath)) {
        console.log('reading from local: ', path.relative(process.cwd(), localPath))
        loadJSON(localPath)
          .then(data => dataCleanup(data))
          .then(data => resolve(data))
          .catch(err => reject(err))
      } else {
        try {
          console.log('fetching from:', url)
          fetch(url)
            .then(res => res.json())
            .then(data => dataCleanup(data))
            .then(data => createAndWrite(localPath, data))
            .then(data => data.error || data.code ? reject(data) : resolve(data))
            .catch(err => console.log(err))
        } catch (err) {
          console.log('error', err)
          reject(err)
        }
      }
    }).then(data => isFunction(cb) ? cb(data) : data)
      .catch(err => console.log(err))
  }

  async loadRequests(urls) {
    let requests = []
    urls.forEach(args => {
      requests.push(this.getData(...args))
    })
    return Promise.all(requests)
      .then(res => Array.isArray(res) ? res.flat(2) : res)
      .catch(function (err) { console.log(err) })
  }

}

module.exports = Request

// module.exports.Request = Request
