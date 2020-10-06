#!/usr/bin/env node

const utils = require('./utils')
const config = require('../config')

const srcFiles = utils.getAllDirectoryFiles('./tmp')

utils.createExportsForDir(srcFiles, './out/tmpExports.js')
