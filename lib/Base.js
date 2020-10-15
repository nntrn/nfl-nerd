const fetch = require('node-fetch')
const config = require('../config')

const { createAndWritePromise, getMe, removeWithoutMutate } = require('../src/utils')

const cachePath = (fileName) => config.cacheDir('')

const defaultProps = {
  name     : '',
  url      : '',
  query    : {},
  required : [],
  optional : [],
  remove   : [],
  useCache : true,
  callback : function (dat) { return dat }
}

class Base {

  constructor(props = {}) {

    const { name, callback, url, optional, required, query,
      exclude, parent, useCache,
      cacheDirPath = props.parent.name ? props.parent.name : props.name,
      ...rest } = { ...defaultProps, ...props.parent, ...props }

    this.name = name
    this.callback = callback
    this.props = rest
    this.url = url
    this.optional = optional
    this.query = query
    this.exclude = exclude
    this.required = required
    this.useCache = useCache
    this.cacheDirPath = cacheDirPath
    this.localCacheFilePath = ''
    this.parent = parent
    this.path = ''

    Object.keys(this.query).forEach(e => {
      this.required.push(e)
    })
  }

  static addEndpoint(endpoint, obj) {
    const fn = (function getParent() {
      return Object.freeze(obj)
    }).call(this)

    return new this({ name: endpoint, parent: fn })
  }

  get(key) {
    return key.split('.').reduce((prev, curr) => prev[curr], this)
  }

  set(obj) {
    Object.entries(obj).forEach(o => {
      if(Array.isArray(this[o[0]])) {
        this[o[0]].push(...o[1])
        return
      }
      if(Object.keys(this).indexOf(o[0]) > -1) {
        Object.assign(this, { [o[0]]: o[1] }, {})
      } else {
        Object.assign(this.props, {
          [o[0]]: o[1]
        })
      }
    })
    return this
  }

  setCallBack(cb) {
    this.callback = cb
    return this
  }

  getCallBack(...args) {
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

  async fetchJsonAsync(query = {}) {
    this.setQuery(query)
    const url = this.getUrl(query)
    try {
      const request = await fetch(url)
      const text = await request.text()
      const json = await removeWithoutMutate(JSON.parse(text), this.exclude)

      return json
    }
    catch (error) {
      console.log(error)
    }
  }

}

module.exports = Base
