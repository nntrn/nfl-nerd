const getCompletedGames = require('../src/getters/getCompletedGames')
const { createAndWrite, testDateIfCompleted, getCSVString } = require('../src/utils')
const events = require('../data/events')

function init() {
  const pbps = events
    .filter(res => testDateIfCompleted(res.date))
    .map(event => getCompletedGames(event))

  return Promise.all(pbps)
    .then(res => res.flat(2))
    .then(json => {
      const date = (new Date()).toISOString().split(':').slice(0, 2).join('_')
      // createAndWrite(`./tmp/all-${date}.json`, json)
      createAndWrite(`./tmp/plays-${date}.csv`, getCSVString(json))
    })

}

init()
