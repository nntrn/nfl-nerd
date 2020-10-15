const fetch = require('node-fetch')
const config = require('../config')

const { createAndWritePromise, removeWithoutMutate } = require('../src/utils')

class Base {

  constructor(props = {}) {

    const {
      name = '',
      url = '',
      query = {},
      required = [],
      optional = [],
      exclude = [],

      parent = {},

      useCache = true,

      callback = function (dat) { return dat },
      ...rest
    } = props

    this.name = name
    this.callback = callback
    this.props = rest
    this.url = url
    this.optional = optional
    this.query = query
    this.exclude = exclude
    this.required = required
    this.useCache = useCache
    // this.cacheDirPath = cacheDirPath
    this.localCacheFilePath = ''
    this.parent = parent
    this.path = ''
    this.data

    Object.keys(this.query).forEach(e => {
      this.required.push(e)
    })
  }

  static addChild(endpoint, obj = {}) {
    const fn = function getParent() {
      return obj
    }

    return new this({ name: endpoint, parent: fn })
  }

  get(key) {
    return key.split('.').reduce((prev, curr) => prev[curr], this)
  }

  setCallback(cb) {
    this.callback = cb
    return this
  }

  getCallback(...args) {
    return this.callback(...args)
  }

  getCachePath(...args) {
    const lookDir = this.parent.name ? this.parent.name : this.name
    return config.cacheDir(lookDir, ...args)
  }

  getLocalCache(filePath) {
    return require(filePath)
  }

  disableCache() {
    this.useCache = false
    return this
  }

  enableCache() {
    this.useCache = true
    return this
  }

  getProps() {
    return this.props
  }

  getParameters() {
    return [this.required, this.optional].flat()
  }

  getUrl(q) {
    return `${this.url}?${this.buildQuery(q)}`
  }

  setQuery(q) {
    Object.assign(this.query, q)
    return this
  }

  getQuery(attr) {
    return attr ? this.query[attr] : this.query
  }

  buildQuery(query) {
    this.setQuery(query)
    return Object
      .entries({ ...this.getQuery(), ...query })
      .filter(f => this.getParameters().includes(f[0]))
      .map(e => `${e[0]}=${e[1]}`).join('&')
  }

  getData() {
    return this.data
  }

  setData(dat) {
    this.data = dat
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

  writeTo(filePath) {
    createAndWritePromise(
      filePath,
      JSON.stringify(this.getData(), null, 2)
    )
  }

}

module.exports = Base
