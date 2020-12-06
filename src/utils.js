const fs = require('fs')
const path = require('path')

exports.createAndWrite = createAndWrite
exports.dateValue = dateValue
exports.deepExclude = deepExclude
exports.isFunction = isFunction
exports.flattenObject = flattenObject
exports.getType = getType
exports.json1L = json1L
exports.objectPicker = objectPicker
exports.getCurrentSeason = getCurrentSeason
exports.hash = hash
exports.prettyJSON = prettyJSON
exports.loadJSON = loadJSON
exports.parseArgs = parseArgs
exports.getFileDir = getFileDir
exports.getNormalize = getNormalize
exports.resolvePath = resolvePath
exports.parseRefId = parseRefId
exports.getCleanDate = getCleanDate
exports.cleanRef = require('./helpers/cleanRef')
exports.mapObjArrays = mapObjArrays

exports.jsParser = require('./helpers/jsParser')
exports.getCSVString = require('./helpers/csvString')
exports.testDateIfCompleted = testDateIfCompleted
exports.testDateIfFuture = testDateIfFuture

exports.toMap = (() => {
  const convert = obj => new Map(Object.keys(obj).map(key => [key, obj[key]]))
  return obj => obj instanceof Map ? obj : convert(obj)
})()

exports.existsSync = fs.existsSync

exports.isFunction = (e) => typeof e === 'function'

exports.dataCleanup = function (obj) {
  const espnExcludeKeys = [
    'ads', 'analytics', 'defaults', 'DTCpackages', 'headshot', 'href',
    'image', 'link', 'links', 'logo', 'geoBroadcasts', 'uid', 'guid'
  ]

  return deepExclude(obj, espnExcludeKeys)
}

function isFunction(fn) {
  return typeof fn === 'function'
}

function testDateIfCompleted(date) {
  return (new Date()) > (new Date(date)).setHours((new Date()).getHours() + 5)
}

function testDateIfFuture(date) {
  return (new Date()) < (new Date(date)).setHours((new Date()).getHours() + 5)
}

function getType(value) {
  return Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1]
}

function dateValue(dateString) {
  return (new Date(dateString)).valueOf()
}

function json1L(obj) {
  return JSON.stringify(obj).replace(/\},\{/g, '},\n  {')
}

function objectPicker(string, obj) {
  return string
    .split('.')
    .reduce((prev, curr) => Array.isArray(prev) ?
      prev.flat().map(c => Array.isArray(c[curr]) ? c[curr].flat(2) :
        c[curr] || Object.assign({}, c[curr])) : prev[curr] || {}, obj)
}

function flattenObject(obj) {
  const capitalize = (s) => String(s).replace(/\b[a-z]/g, e => e.toUpperCase())
  var toReturn = {}
  Object.keys(obj).forEach(key => {
    if(typeof obj[key] === 'object') {
      const flatObject = flattenObject(obj[key])
      Object.keys(flatObject).forEach(e => {
        const propName = `${isNaN(+key) ? key : `[${key}]`}${capitalize(e)}`
        toReturn[propName] = flatObject[e]
      })
    } else { toReturn[key] = obj[key] }
  })
  return toReturn
}

function createAndWrite(dirPath = 'file.json', data) {
  fs.mkdir(path.dirname(dirPath), { recursive: true }, function () {
    if(typeof data === 'object') {
      fs.writeFileSync(dirPath, JSON.stringify(data))
    } else {
      fs.writeFileSync(dirPath, data)
    }
  })
  return data
}

function deepExclude(data, excludeKeys) {
  return Object.keys(data).reduce((object, key) => {
    if(!excludeKeys.includes(key)) {
      object[key] = typeof data[key] === 'object' ?
        deepExclude(data[key], excludeKeys) : data[key]
    }
    return object
  }, Array.isArray(data) ? [] : {})
}

function getFileDir() {
  return path.dirname(require.main.filename)
}

function getNormalize(fp) {
  return path.normalize(getFileDir() + '/', fp)
}

function resolvePath(fp) {
  return path.normalize(getFileDir() + '/', fp)
}

function getCurrentSeason() {
  return (new Date()).getMonth() > 8 ?
    new Date().getFullYear() :
    (new Date().getFullYear() - 1)
}

function hash(key) {
  if(typeof key !== 'string') {
    key = JSON.stringify(key)
  }
  let hashValue = 0
  const stringTypeKey = `${key}${typeof key}`

  for(let index = 0; index < stringTypeKey.length; index++) {
    const charCode = stringTypeKey.charCodeAt(index)
    hashValue += charCode << (index * 8)
  }

  return hashValue
}

function prettyJSON(obj) {
  return JSON.stringify(obj)
    .replace(/([\{\}\,:])/g, '$1 ')
    .replace(/ , /g, ',\n  ')
}

function loadJSON(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, content) => {
      if(err) { reject(err) } else {
        try { resolve(JSON.parse(content))
        } catch (err) { reject(err) }
      }
    })
  })
}

function parseArgs(args) {
  if(args.join(' ').indexOf('--') < 0) {
    return args
  }

  let stdIn = args.join(' ').split('>')[0].split(' ')
  return Object.fromEntries(stdIn
    .join(' ')
    .split('--')
    .filter(Boolean)
    .map(e => {
      let a = e.trim().split(' ')
      let a2 = a.length > 2 ? a.slice(1,) : a.slice(1,).toString()
      return [a[0], a2]
    }))
}

function parseRefId(ref, key) {
  let re = new RegExp(`\/${key}\/([\\d]+)`)
  return ref.match(re) ? ref.match(re).slice(-1)[0] : ref
}

function getCleanDate(dt = '') {
  return dt ?
    (new Date(dt)).toLocaleDateString().replace(/\//g, '-') :
    (new Date()).toLocaleDateString().replace(/\//g, '-')
}

function mapObjArrays(arr, id = 'id', item) {
  const objMap = new Map()
  arr.forEach(obj => {
    if(item) {
      if(isFunction(item))
        objMap.set(obj[id], item(obj))
      else
        objMap.set(obj[id], obj[item])
    } else {
      objMap.set(obj[id], obj)
    }
  })
  return objMap
}
