const fs = require('fs')
const path = require('path')
const util = require('util')
const { cwd } = require('process')

exports.writeFile = util.promisify(fs.writeFile)

exports.readFile = util.promisify(fs.readFile)

exports.existsSync = fs.existsSync

// exports.pathExists = fs.pathExists

exports.cwd = cwd

const fsPromises = fs.promises

const getType = (value) => Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1]

exports.getType = getType

// usage: getme('drives.previous.3.team',obj)
// const getMe = (string, obj) => string.split('.').reduce((prev, curr) =>
//   Array.isArray(prev) ? prev.map(c => c[curr]) : prev[curr], obj)

// usage: getme('drives.previous.3.team',obj)
const getMe = (string, obj) => string.split('.').reduce((prev, curr) => Array.isArray(prev) ?
  prev.map(c => Array.isArray(c[curr]) ? c[curr].flat() : c[curr]) : prev[curr], obj)

exports.getMe = getMe

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
  fsPromises.mkdir(path.dirname(dirPath), { recursive: true })
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

// /   time       output
//    10:30   => 00:10:30
//       10   => 00:00:10
//  20:1:10   => 20:01:10
function normalizeClockTime(time) {
  return [0, 0, 0, ...time.split(':')].filter(Boolean).slice(-3).map(e => e.padStart(2, '0')).join(':')
}

exports.normalizeClockTime = normalizeClockTime

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
