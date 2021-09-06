const path = require('path')

module.exports = {
  root           : __dirname,
  getDir         : (...args) => path.normalize(path.join(__dirname, ...args)),
  getPath        : (...args) => path.resolve(...args),
  getRelativePath: (to) => './' + path.relative(__dirname, to)
}
