const { api } = require('../../index')
const Request = require('../../src/request')
const seasons = require('../../data/seasons')
const removeDash = (str) => str.replace(/\-/g, '')

const { getCurrentSeason, getYMD } = require('../utils')

const seasonMapper = new Map(seasons.map(e => {
  var dt = new Date(e.startDate)
  dt.setDate(dt.getDate() + 40)
  const startDate = dt.toISOString().split('T')[0]

  // return [Number(e.year), [removeDash(startDate), removeDash(e.endDate)]]

  return [Number(e.year)]
}))

function cb(req) {
  return req.events.map(e => ({
    gameId    : e.id,
    name      : e.shortName,
    date      : (new Date(e.date)).toLocaleDateString(),
    seasontype: e.season.type,
    year      : e.season.year
  }))
}

function getSeasonGames(year = getCurrentSeason(), callback = cb) {
  const tmpDate = getYMD()
  const scheduleRequest = new Request('schedule')

  return scheduleRequest.getData(
    api.scoreboard2(year),
    `tmp/events/${tmpDate}/${year}.json`,
    callback
  )
}

module.exports = getSeasonGames
