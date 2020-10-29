const fs = require('fs')
const path = require('path')
const util = require('util')

exports.writeFile = util.promisify(fs.writeFile)

exports.readFile = util.promisify(fs.readFile)

exports.existsSync = fs.existsSync

const fsPromises = fs.promises

const getType = (value) => Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1]

exports.getType = getType

exports.dateValue = (dateString) => (new Date(dateString)).valueOf()

const objectPicker = (string, obj) => string.split('.')
  .reduce((prev, curr) => Array.isArray(prev) ?
    prev.flat().map(c => Array.isArray(c[curr]) ?
      c[curr].flat() : c[curr]) : prev[curr], obj)

exports.objectPicker = objectPicker

const capitalize = (s) => String(s).replace(/\b[a-z]/g, e => e.toUpperCase())

function flattenObjectCamel(obj) {
  var toReturn = {}
  Object.keys(obj).forEach(key => {
    if(typeof obj[key] === 'object') {
      const flatObject = flattenObjectCamel(obj[key])
      Object.keys(flatObject).forEach(e => {
        const propName = `${isNaN(+key) ? key : `[${key}]`}${capitalize(e)}`
        toReturn[propName] = flatObject[e]
      })
    } else { toReturn[key] = obj[key] }
  })
  return toReturn
}

exports.flattenObjectCamel = flattenObjectCamel

// recursively create necessary paths before writing
function createAndWrite(dirPath = './tmp/data.json', data) {
  fs.mkdir(path.dirname(dirPath), { recursive: true }, function () {
    fs.writeFileSync(dirPath, data)
  })
}

exports.createAndWrite = createAndWrite

function createAndWritePromise(dirPath = './tmp/data.json', data) {
  return fsPromises.mkdir(path.dirname(dirPath), { recursive: true })
    .then(result => fs.writeFileSync(dirPath, data))
    .catch(err => console.error(err))
    .finally((info) => console.log('Created/modified:', dirPath))
}

exports.createAndWritePromise = createAndWritePromise

function getIfExists(dirPath = '') {
  if(fs.existsSync(dirPath)) {
    const content = require(dirPath)
    return content
  }
  return false
}

exports.getIfExists = getIfExists

function createCSV(data) {
  const keys = Object.keys(data[0]).join(',')
  const values = data.map(e => Object.values(e).join(',')).join('\n')

  return [keys, values].join('\n')
}

exports.createCSV = createCSV

function getFiles(startPath, nameRe = /.*/) {
  var results = []

  function finder(paths) {
    var files = fs.readdirSync(paths)

    for(var i = 0; i < files.length; i++) {
      var fpath = path.join(paths, files[i])
      var stats = fs.statSync(fpath)

      if(stats.isDirectory()) finder(fpath)
      if(stats.isFile() && nameRe.test(files[i])) results.push(fpath)
    }
  }

  finder(startPath)
  return results
}

exports.getFiles = getFiles

function dataCleanup(obj) {
  const attr = [
    'ads', 'analytics', 'DTCpackages', 'links', 'link', 'logo', 'href',
    'defaults', 'headshot', 'image']

  return deepExclude(obj, attr)
}

exports.dataCleanup = dataCleanup

function deepExclude(data, excludeKeys) {
  return Object.keys(data).reduce((object, key) => {
    if(!excludeKeys.includes(key)) {
      object[key] = typeof data[key] === 'object' ?
        deepExclude(data[key], excludeKeys) : data[key]
    }
    return object
  }, Array.isArray(data) ? [] : {})
}

exports.deepExclude = deepExclude

const json1L = (obj) => JSON.stringify(obj).replace(/\},\{/g, '},\n  {')

exports.json1L = json1L

function groupBy(collection, property) {
  const newCollection = {}
  collection.forEach((item, index) => {
    let key = item[property]
    if(typeof key === 'string') {
      key = key.toLowerCase()
    }
    if(!Object.prototype.hasOwnProperty.call(newCollection, key)) {
      newCollection[key] = []
    }
    newCollection[key].push(item)
  })
  return newCollection
}

exports.groupBy = groupBy
