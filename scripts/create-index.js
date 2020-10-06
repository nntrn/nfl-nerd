
const fs = require('fs')
const path = require('path')
const config = require('../config')
const { createAndWrite } = require('../src/utils')

const srcFiles = fs.readdirSync(path.join(config.dirname, 'src')).filter(e => /^get.*/.test(e))

const outDir = 'test2'
const moduleExports = []
const requireImports = []

const makeFileContent = name => [
  `const { ${name} } = require('../src/${name}')`,
  "const { createAndWrite } = require('../src/utils')\n",
  `${name}()\n`
].join('\n')

srcFiles.forEach(e => {
  const fileName = e.split('.')[0]
  const outFilePath = `${config.dirname}/${outDir}/${fileName}.js`

  // write example file if it doesn't already exist
  if(!fs.existsSync(outFilePath)) {
    createAndWrite(outFilePath, makeFileContent(fileName))
    // fs.writeFileSync(outFilePath, makeFileContent(fileName), { flag: 'wx', encoding: 'utf8' })
  }

  requireImports.push(`const { ${fileName} } = require('./src/${fileName}')`)
  moduleExports.push(`  ${fileName}: ${fileName},`)
})

const fileContent = `${requireImports.join('\n')}\n\nmodule.exports = {\n${moduleExports.join('\n')}\n}\n`

fs.writeFileSync(path.join(config.dirname, 'index.js'), fileContent)
