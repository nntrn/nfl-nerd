const fetch = require('node-fetch')
const config = require('../config')
const CURRENT_YEAR = new Date().getFullYear()
const REG_SEASON_WEEKS = 17
const BASE_URL = 'https://cdn.espn.com/core/nfl/'

const { getMe, createAndWrite, existsSync } = require('./utils')

async function getSchedule(year = CURRENT_YEAR, getScheduleCb = getScheduleObj) {
  let promises = []

  for(var wk = 0; wk < REG_SEASON_WEEKS; wk++) {
    var WEEK = (wk + 1)
    let fetchUrl = `${BASE_URL}schedule?xhr=1&year=${year}&week=${WEEK}`
    const localFile = `${config.cache}/schedule/${year}/week-${WEEK}.json`

    if(existsSync(localFile)) {
      console.log('reading local file for:', fetchUrl)
      return getScheduleCb(require(localFile))
    }

    promises.push(fetch(fetchUrl)
      .then((resp) => resp.json())
      .then((res) => {

        const contentDefaults = getMe('content.defaults', res)

        if(year < contentDefaults.year || (year <= contentDefaults.year && WEEK < contentDefaults.WEEK)) {
          console.log('saved local summary of schedule', [year, WEEK])
          createAndWrite(localFile, JSON.stringify(res))
        }

        return getScheduleCb(res)
      }))
  }

  const returnArr = await Promise.all(promises)
  return returnArr.flat()
}

function getScheduleObj(data) {
  const obj = Object.values(data.content.schedule).map(e => Object.values(e.games)
    .map(g => {

      let game = g.shortName.split(' @ ')

      let linescores = g.status.type.name === 'STATUS_FINAL' ?
        g.competitions[0].competitors.map(o => Object.values(o.linescores)
          .map(c => c.value)) : [[0, 0, 0, 0], [0, 0, 0, 0]]

      return {
        gameId     : this.id,
        date       : new Date(g.date).toLocaleDateString(),
        time       : new Date(g.date).toLocaleTimeString(),
        name       : g.shortName,
        title      : g.name,
        awayGame   : game[0],
        homeGame   : game[1],
        status     : g.status.type.name,
        ...data.content.parameters,
        linescores : {
          [game[0]] : linescores[0].join(),
          [game[1]] : linescores[1].join(),
          total     : linescores[1].map((l, li) => l + linescores[0][li]).join()
        },
        api: {
          schedule   : this.fetchUrl,
          game       : `${BASE_URL}game?xhr=1&gameId=${g.id}`,
          summary    : `${config.espn.summary}?event=${g.id}`,
          playbyplay : `${BASE_URL}playbyplay?xhr=1&gameId=${g.id}`,
          boxscore   : `${BASE_URL}boxscore?xhr=1&gameId=${g.id}`,
        }
      }

    }))

  return obj.flat()
}

module.exports.getSchedule = getSchedule
