// run `node examples/team-pbps` in CLI to get output

const papaparse = require('papaparse')
const nflnerd = require('../lib')
const schedule = require('../games/season2020')

const { createAndWrite, dateValue, flattenObjectCamel } = require('../src/utils.js')

function getGames(team) {
  const yesterday = (new Date()).setDate(new Date().getDate() - 1)
  return schedule
    .filter(e => e.name.indexOf(team) > -1)
    .filter(e => dateValue(e.date) < dateValue(yesterday))
    .map(e => e.gameId)
}

function getGameIds(team) {
  if(Array.isArray(team)) {
    return team.map(e => getGames(e)).flat()
  }
  return getGames(team)
}

const teams = ['DAL', 'PHI']

nflnerd
  .getPlayByPlays(getGameIds(teams))
  .then(data => {
    const output = data.map(e => flattenObjectCamel(e))
    createAndWrite(
      `./out/pbps-${teams.join('-')}.json`,
      JSON.stringify(output, null, 2)
    )
    return output.map(o => {
      const [ateam, hteam] = o.title.split(' vs. ')

      var ts = o.homeScore, ots = o.awayScore

      if(teams.includes(ateam)) {
        ts = o.awayScore
        ots = o.homeScore
      }
      return {
        ...o,
        isTarget: teams.includes(o.driveTeam),
        targetScore: ts,
        otherTeam: ots
      }
    })
  })
  .then(data2 => {
    const csvOutput = papaparse.unparse(data2, {
      quotes: false,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ',',
      header: true,
      newline: '\n',
      skipEmptyLines: false,
      columns: null
    })

    createAndWrite(
      `./out/pbp-${teams.join('-')}.csv`,
      csvOutput
    )
  })

