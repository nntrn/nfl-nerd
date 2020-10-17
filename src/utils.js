const fs = require('fs')
const path = require('path')
const util = require('util')

exports.writeFile = util.promisify(fs.writeFile)

exports.readFile = util.promisify(fs.readFile)

exports.existsSync = fs.existsSync

// exports.pathExists = fs.pathExists

const fsPromises = fs.promises

const getType = (value) => Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1]

exports.getType = getType

// usage: getme('drives.previous.3.team',obj)
// const objectPicker = (string, obj) => string.split('.').reduce((prev, curr) =>
//   Array.isArray(prev) ? prev.map(c => c[curr]) : prev[curr], obj)

// usage: objectPicker('drives.previous.3.team',obj)
// const objectPicker = (string, obj) => string.split('.').reduce((prev, curr) => Array.isArray(prev) ?
//   prev.map(c => Array.isArray(c[curr]) ? c[curr].flat() : c[curr]) : prev[curr], obj)

const objectPicker = (string, obj) => string.split('.').reduce((prev, curr) =>
  Array.isArray(prev) ? prev.flat()
    .map(c => Array.isArray(c[curr]) ? c[curr].flat() : c[curr]) : prev[curr], obj)

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
    const d = require(dirPath)
    return d
  }
  return false
}

exports.getIfExists = getIfExists

function removeObjAttr(data, attrToRemove = []) {
  const keys = Object.keys(data)
  attrToRemove.forEach(e => {
    if(keys.indexOf(e) > -1) {
      delete data[e]
    }
  })
  return data
}

exports.removeObjAttr = removeObjAttr

// https://flaviocopes.com/how-to-remove-object-property-javascript/
function removeWithoutMutate(data, attrToRemove) {
  return Object.keys(data).reduce((object, key) => {
    if(!attrToRemove.includes(key)) {
      object[key] = data[key]
    }
    return object
  }, {})
}

exports.removeWithoutMutate = removeWithoutMutate

function createCSV(data) {
  const keys = Object.keys(data[0]).join(',')
  const values = data.map(e => Object.values(e).join(',')).join('\n')

  return [keys, values].join('\n')
}

exports.createCSV = createCSV

// https://stackoverflow.com/a/52429363
function filterObject(obj, key) {
  if(!obj || (typeof obj === 'string')) {
    return obj
  }
  obj = Object.assign({}, obj)
  if(obj[key]) {
    delete obj[key]
  }
  Object.keys(obj).forEach(k => {
    obj[k] = filterObject(obj[k], key)
  })

  return obj
}

exports.filterObject = filterObject
