const nflnerd = require('../index')
const config = require('../config')
const { createAndWrite } = require('./utils')

const outputFolder = `${config.dirname}/data`
const CURRENT_YEAR = +(new Date().getFullYear())

const last3Years = [
  // CURRENT_YEAR,
  // CURRENT_YEAR - 1,
  // CURRENT_YEAR - 2
  2019
]

;(async function () {

  const teams = await nflnerd.getTeams()
  const teamAbbr = await teams.map(e => e.abbreviation)

  createAndWrite(`${outputFolder}/teams.json`, JSON.stringify(teams, null, 2))

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
              finishedGameIds: finishedIDs,
              attrs: Object.keys(allPbp.flat()[0]),
              data: allPbp.flat()
            }, null, 2))

        }).catch((error) => {
          console.log(error)
        })

    }) })
}())
