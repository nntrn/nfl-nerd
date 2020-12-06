const path = require('path')

module.exports = {
  root: __filename,
  getDir: (...args) => path.normalize(path.join(__filename, ...args))
}
