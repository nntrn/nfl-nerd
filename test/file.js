const fs = require('fs')
const config = require('../config')

function getAllDirectoryFiles(dirPath) {
  console.log(dirPath)

  const out = fs.readdirSync(dirPath)
    .map(e => options.returnCompletePath ? [dirPath, e].join('/') : e)
    .map(e => {
      if(fs.statSync(e).isDirectory()) {
        return getDirectoryFiles(e, options)
      }
      return e
    })
    .flat()

  debugger
  return out
}

debugger
const content = getAllDirectoryFiles(config.getDir('__data__'))

console.log(content)
