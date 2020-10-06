const schedule2020 = require('../tmp/schedule/2020')
const { getPlayByPlay } = require('../src/getPlayByPlay')
const { createAndWrite } = require('../src/utils')

const teams = ['NE', 'KC', 'ATL', 'GB']

teams.forEach(async team => {
  const promises = []

  schedule2020
    .filter(e => e.status === 'STATUS_FINAL')
    .filter(e => e.name.indexOf(team) > -1)
    .forEach(e => {
      const pbp = getPlayByPlay(e.gameId)
      promises.push(pbp)
    })

  const allPbp = await Promise.all(promises)

  createAndWrite(`./tmp/pbp/${team}.json`, JSON.stringify({
    date: new Date().toLocaleString(),
    team: team,
    data: allPbp.flat()
  }, null, 2))

})
