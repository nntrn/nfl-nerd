const { api, scheduleRequest } = require('../../index')
const { getCurrentSeason } = require('../utils')

function cb(req) {
  return req.events.map(e => ({
    gameId     : e.id,
    name       : e.shortName,
    date       : (new Date(e.date)).toLocaleString(),
    seasontype : e.season.type,
    year       : e.season.year
  }))
}

const tmpDate = (new Date()).toISOString().split('T')[0]

module.exports = function getSeasonGames(
  year = getCurrentSeason(), callback = cb) {
  return scheduleRequest
    .getData(api.seasons(year), `tmp/events/${tmpDate}/${year}.json`, callback)
}

