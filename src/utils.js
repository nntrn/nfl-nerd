const fs = require('fs')
const path = require('path')

exports.existsSync = fs.existsSync

const getType = (value) => Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1]

exports.getType = getType

// usage: getme('drives.previous.3.team',obj)
const getMe = (string, obj) => string.split('.').reduce((prev, curr) => prev[curr], obj)

exports.getMe = getMe

function capitalize(s) {
  return String(s).replace(/\b[a-z]/g, e => e.toUpperCase())
}

function flattenObjectCamel(obj) {
  var toReturn = {}
  Object.keys(obj).forEach(key => {
    if(typeof obj[key] === 'object') {
      const flatObject = flattenObjectCamel(obj[key])
      Object.keys(flatObject).forEach(e => {
        const propName = `${key}${capitalize(e)}`.replace(/\[?(\d+)\]?/g, '[$1]')
        toReturn[propName] = flatObject[e]
      })
    } else {
      toReturn[key] = obj[key]
    }
  })
  return toReturn
}

exports.flattenObjectCamel = flattenObjectCamel

// recursively create necessary paths before writing
function createAndWrite(dirPath = './tmp/data.json', data) {
  fs.mkdir(path.dirname(dirPath), { recursive: true }, function () {
    fs.writeFileSync(dirPath, data)
    console.log(dirPath)
  })
}

exports.createAndWrite = createAndWrite

function getIfExists(dirPath = '.') {
  if(fs.existsSync(dirPath)) {
    console.log('file exists: ', dirPath)
    const g = require(dirPath)
    return g
  }
  return ''
}

exports.getIfExists = getIfExists

// /   time       output
//    10:30   => 0:10:30
//       10   => 0:00:10
//  20:1:10   => 20:1:10
function formatClockTime(time) {
  return [0, 0, 0, ...time.split(':')].filter(Boolean).slice(-3).join(':')
}

// curry function for measuring seconds since previous time
// format: mm:ss
function getElapsed(clock1) {
  return (clock2) => {
    ((new Date(`1/1/1975 ${formatClockTime(clock1)}`)) - (new Date(`1/1/1975 ${formatClockTime(clock2)}`))) / 1000
  }
}

exports.getElapsed = getElapsed

