const teamRoster = require('../../data/roster')
const { mapObjArrays } = require('../utils')
const _roster = mapObjArrays(teamRoster, 'id')

function getAthlete(id) {
  return _roster.has(id) ?
  `${_roster.get(id).name} (${_roster.get(id).position})` : id
}

module.exports = getAthlete
