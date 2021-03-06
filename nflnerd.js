const getAllGameRelated = require('./src/getters/getAllGameRelated')
const getAthlete = require('./src/getters/getAthlete')
const getPlayByPlays = require('./src/getters/getPlayByPlays')
const getSeasonGames = require('./src/getters/getSeasonGames')

const api = require('./src/api')
const teams = require('./src/teams')
const Request = require('./src/request')

const {
  jsParser,
  cleanRef,
  createAndWrite,
  dateValue,
  deepExclude,
  isFunction,
  flattenObject,
  getType,
  json1L,
  objectPicker,
  getCurrentSeason,
  hash,
  prettyJSON,
  loadJSON,
  parseArgs,
  getFileDir,
  getNormalize,
  resolvePath,
  parseRefId,
  getCleanDate,
  mapObjArrays,
  getCSVString,
  testDateIfCompleted,
  testDateIfFuture,
  updateObjectTemplate,
  deepUpdateObject,
  dataCleanup } = require('./src/utils')

module.exports = {
  api,
  Request,
  teams,
}
module.exports.getters = {
  getAllGameRelated,
  getAthlete,
  getPlayByPlays,
  getSeasonGames
}
module.exports.utils = {
  jsParser,
  cleanRef,
  createAndWrite,
  dateValue,
  deepExclude,
  isFunction,
  flattenObject,
  getType,
  json1L,
  objectPicker,
  getCurrentSeason,
  hash,
  prettyJSON,
  loadJSON,
  parseArgs,
  getFileDir,
  getNormalize,
  resolvePath,
  parseRefId,
  getCleanDate,
  mapObjArrays,
  getCSVString,
  testDateIfCompleted,
  testDateIfFuture,
  updateObjectTemplate,
  deepUpdateObject,
  dataCleanup
}
