const {
  createAndWrite,
  testDateIfCompleted,
  getCSVString,
  flattenObject
} = require('../src/utils')

const getPlayByPlays = require('../src/getters/getPlayByPlays')
const events = require('../data/events')

function getPlayCsv() {
  const pbps = events
    .filter(res => testDateIfCompleted(res.date))
    .map(event => getPlayByPlays(event))

  return Promise.all(pbps)
    .then(res_1 => res_1.flat(2).map(e => flattenObject(e)))
    .then(json => {
      // createAndWrite(`./tmp/plays-${(new Date()).toDateString()}.json`, JSON.stringify(json))
      createAndWrite(`./tmp/plays-${(new Date()).toDateString()}.csv`, getCSVString(json))
    })
    .catch(err => console.log('ERROR', err))
}

getPlayCsv()
