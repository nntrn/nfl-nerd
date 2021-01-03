const fs = require('fs')
const config = require('../config')

const util = require('util')

function getFiles(dir, files_) {
  files_ = files_ || []
  var files = fs.readdirSync(dir)
  for(var i in files) {
    var name = dir + '/' + files[i]
    if(fs.statSync(name).isDirectory()) {
      getFiles(name, files_)
    } else {
      files_.push(name)
    }
  }
  return files_
}
const ff = getFiles(config.getPath('__data__'))

console.log(util.inspect(ff.map(e => config.getRelativePath(e)), { maxArrayLength: null }))

console.log(util.inspect(process, { depth: null, maxArrayLength: null }))

// console.dir(process, { depth: null })
// console.log(process)
