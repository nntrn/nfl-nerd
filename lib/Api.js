const fetch = require('node-fetch')
const config = require('../config')

const {
  createAndWritePromise,
  getMe,
  removeWithoutMutate,
  cwd
} = require('../src/utils')

class Api {
  constructor(props) {

    Object.assign(this, {
      name : '',
      url  : '',
      // filename : '',

      query: {},

      required : [],
      optional : [],
      exclude  : [],
      data     : [],

      saveToDir : cwd(),
      cacheDir  : config.cacheDir(props.name),

      callback: function (data) { return data },

      ...props
    })

    Object.keys(this.query).forEach(e => {
      this.required.push(e)
    })
  }

  static addChild(name, obj = {}) {
    const fn = function getParent() { return obj }
    return new this({ ...fn, parent: fn, name: name })
  }

  get(key) {
    return key.split('.').reduce((prev, curr) => prev[curr], this)
  }

  // setFilename(name) {
  //   this.filename = name
  //   return this
  // }

  // getFilename() {
  //   return this.filename
  // }

  getCacheFileName(filename = this.getFilename()) {
    return config.cacheDir(this.cacheDir, filename + '.json')
  }

  getLocalFileName(filename = this.getFilename()) {
    return `${this.saveToDir}/out/${filename}.json`
  }

  setCallback(cb) {
    this.callback = cb
    return this
  }

  getCallback() {
    return this.callback
  }

  getJson(dat = this.getData()) {
    return this.getCallback(dat)
  }

  setCacheDir(...args) {
    this.cacheDir = config.cacheDir(lookDir, ...args)
    return this
  }

  getLocalCache(filePath) {
    return require(filePath)
  }

  getParameters() {
    return [this.required, this.optional].flat()
  }

  getUrl(q = {}) {
    return `${this.url}?${this.buildQuery(q)}`
  }

  setQuery(q) {
    Object.assign(this.query, q)
    return this
  }

  getQuery() {
    return this.query
  }

  buildQuery(query) {
    this.setQuery(query)
    return Object
      .entries({ ...this.getQuery(), ...query })
      .filter(f => this.getParameters().includes(f[0]))
      .map(e => `${e[0]}=${e[1]}`).join('&')
  }

  setData(dat) {
    this.data = dat
    return this
  }

  getData() {
    return this.data
  }

  addData(dat) {
    this.data.push(dat)
    return this
  }

  async writeTo(filePath) {
    await createAndWritePromise(
      filePath,
      JSON.stringify(this.getData(), null, 2)
    )
    return this
  }

  async fetchJsonAsync(query = {}) {
    this.setQuery(query)
    const url = this.getUrl(query)
    try {
      const request = await fetch(url)
      const text = await request.text()
      const json = await removeWithoutMutate(JSON.parse(text), this.exclude)

      this.setData(json)
      return json
    }
    catch (error) {
      console.log(error)
    }
  }

}

module.exports = Api
