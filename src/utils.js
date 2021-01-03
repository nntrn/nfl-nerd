
const fs = require('fs')
const path = require('path')
const papaparse = require('papaparse')

const jsParser = require('./helpers/jsParser')
const cleanRef = require('./helpers/cleanRef')

exports.jsParser = jsParser
exports.cleanRef = cleanRef
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
exports.mapObjArrays = mapObjArrays
exports.getCSVString = getCSVString
exports.testDateIfCompleted = testDateIfCompleted
exports.testDateIfFuture = testDateIfFuture
exports.updateObjectTemplate = updateObjectTemplate
exports.existsSync = fs.existsSync
exports.deepUpdateObject = deepUpdateObject

exports.dataCleanup = dataCleanup

function dataCleanup(obj) {
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

function createAndWrite(dirPath = 'file.json', data = '') {
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
  var obj2 = obj
  if(typeof obj !== 'object') {
    obj2 = JSON.parse(obj2)
  }
  return JSON.stringify(obj2)
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

// Update only values for keys matching initial object
function updateObjectTemplate(obj/* ,*/) {
  if(typeof obj !== 'object') { return obj }
  for(let i = 0; i < arguments.length; i++) {
    for(let prop in arguments[i]) {
      const _obj = Object.assign({}, obj)
      const value = arguments[i][prop]
      if(Object.keys(_obj).includes(prop)) {
        Object.assign(obj, {
          [prop]: typeof obj[prop] === 'function' ?
            obj[prop](value) : value
        })
      }
    }
  }
  return obj
}

function deepUpdateObject(template, obj) {
  let copy = { ...template }
  for(let i in obj) {
    if(Object.keys(template).includes(i)) {
      copy[i] = obj[i]
      if(obj[i] &&
         typeof obj[i] === 'object' &&
         typeof template[i] !== 'function'
      ) {
        // `ex1:{ key:'' }`  => objects with w/ keys
        // `ex2:{}`          => empty objects
        let temp = Object.keys(template[i]).length > 0 ?
        /* 1*/ template[i] : /* 2*/ { ...template[i], ...obj[i] }
        copy[i] = { ...template[i], ...deepUpdateObject(temp, obj[i]) }

      } else if(typeof template[i] === 'function') {
        copy[i] = template[i](obj[i])
      }
    }
  }
  return copy
}

function getCSVString(data, options = {}) {
  const ppOptions = {
    quotes         : false,
    quoteChar      : '"',
    escapeChar     : '"',
    delimiter      : ',',
    header         : true,
    newline        : '\n',
    skipEmptyLines : true,
    columns        : null,
    ...options
  }
  // traverse array and flatten each object
  if(Array.isArray(data)) {
    const data2 = data.map(e => flattenObject(e))
    return papaparse.unparse(data2, ppOptions)
  }

  return papaparse.unparse(flattenObject(data), ppOptions)
}
