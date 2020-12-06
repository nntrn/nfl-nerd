const { api, _requests } = require('../../index')
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

module.exports = function getSeasonGames(year, callback = cb) {
  const szn = year || getCurrentSeason()

  return _requests.schedule.getData(api.seasons(szn), `events/${szn}.json`, callback)
}

