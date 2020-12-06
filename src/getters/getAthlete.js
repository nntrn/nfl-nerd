const teams = require('../teams')
const teamRoster = require('../../data/roster')
const getGameData = require('../game')
const { mapObjArrays } = require('../utils')

const _roster = mapObjArrays(teamRoster, 'id', 'name')

function getAthlete(id) {
  return _roster.has(id) ? _roster.get(id) : id
}
module.exports = getAthlete
