const fetch = require('node-fetch')
const { dataCleanup } = require('../src/utils')

class RequestService {
  constructor() {
    this.cleanup = true
  }

  doNotCleanup() {
    this.cleanup = false
  }

  async getRequest(url) {
    return fetch(url)
      .then(res => res.json())
      .catch(err => {
        console.log('Error: ', err)
      })
  }

  async getRequest(urlArr, cb) {
    let promises = []
    for(var url = 0; url < urlArr.length; url++) {
      promises.push(
        fetch(urlArr[url])
          .then((resp) => resp.json())
          .then(dat => cb ? cb(dat) : dat)
          .then(res => this.cleanup ? dataCleanup(res) : res)
          .catch(err => console.error(err))
      )
    }
    const returnArr = await Promise.all(promises)
    return returnArr.flat()
  }

}

module.exports = new RequestService()
