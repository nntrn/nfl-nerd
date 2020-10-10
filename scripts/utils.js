const fs = require('fs')
const path = require('path')

const { createAndWrite } = require('../src/utils')

// get all files and nested files from directory
function getAllDirectoryFiles(dirPath) {
  return fs.readdirSync(dirPath)
    .map(e => [dirPath, e].join('/'))
    .map(e => fs.statSync(e).isDirectory() ? getAllDirectoryFiles(e) : e)
    .flat()
}

function getRelative(fromPath, toPath = 'out/index.js') {
  return path.relative(path.dirname(toPath), path.join(process.cwd(), fromPath))
}

// wrapInObject('nested/objects/by/path',{annie:'hi'},'/')
// => {"nested":{"objects":{"by":{"path":{"annie":"hi"}}}}}
function wrapInObject(attr = 'key', value = 'value', splitOn = '.') {
  const part = attr.split(splitOn)
  const obj = Object.assign({}, { [part.pop()]: value })

  return part.length ? wrapInObject(part.join(splitOn), obj, splitOn) : obj

}

function extend(target) {
  for(var i = 1; i < arguments.length; ++i) {
    var from = arguments[i]
    if(typeof from !== 'object') continue
    for(var j in from) {
      if(from.hasOwnProperty(j)) {
        target[j] = typeof from[j] === 'object'
          ? extend({}, target[j], from[j])
          : from[j]
      }
    }
  }
  return target
}

function createExportsForDir(files, toPath = 'out/index.js') {
  var obj = {}

  files.forEach(e => {
    const cleanPath = e.replace(/(\.\w+)$/, '').split(/[^\w\d]/g).filter(Boolean).join('/')
    const test = wrapInObject(cleanPath, `require('${getRelative(e, toPath)}')`, '/')

    Object.assign(obj, extend({}, obj, test))
  })

  const objString = JSON.stringify(obj, null, 2).replace(/"/g, '')
  createAndWrite(toPath, `module.exports = ${objString}\n`)
  return obj
}

module.exports = {
  getAllDirectoryFiles,
  createAndWrite,
  createExportsForDir,
  extend,
  wrapInObject,
  getRelative,
}
