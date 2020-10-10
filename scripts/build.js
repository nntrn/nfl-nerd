const nflnerd = require('../index')
const config = require('../config')
const { createAndWrite } = require('./utils')

const outputFolder = `${config.dirname}/data`
const CURRENT_YEAR = +(new Date().getFullYear())

const last3Years = [
  CURRENT_YEAR,
  // CURRENT_YEAR - 1, CURRENT_YEAR - 2
]

;(async function () {

  const teams = await nflnerd.getTeams()
  const teamAbbr = teams.map(e => e.abbreviation)

  teamAbbr.forEach(team => {
    last3Years.forEach(year => {
      nflnerd.getSchedule(year)
        .then(data => {
          createAndWrite(`${outputFolder}/schedule/${year}.json`, JSON.stringify(data, null, 2))
          return data
        })
        .then(async yearSchedule => {
          const promises = []
          const finishedIDs = []

          yearSchedule
            .filter(e => e.status === 'STATUS_FINAL')
            .filter(e => e.name.indexOf(team) > -1)
            .forEach(e => {
              const pbp = nflnerd.getPlayByPlay(e.gameId)
              finishedIDs.push(e.gameId)
              promises.push(pbp)
            })

          const allPbp = await Promise.all(promises)

          createAndWrite(`${outputFolder}/pbp/${year}/${team}.json`,
            JSON.stringify({
              date: new Date().toLocaleString(),
              team: team,
              ids: finishedIDs,
              data: allPbp.flat()
            }, null, 2))
        })

    }) })
}())
