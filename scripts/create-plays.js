const { utils, getters } = require('../nflnerd')
const { getPlayByPlays, getSeasonGames } = getters

const {
  createAndWrite,
  testDateIfCompleted,
  getCSVString,
  flattenObject,
  getCurrentSeason,
  parseArgs,
  dateValue,
  getYMD
} = utils

const argv = {
  season: getCurrentSeason(),
  ...parseArgs(process.argv.slice(2))
}

function createPlayByPlays(args) {
  getSeasonGames(args.season)
    .then(res => res.sort((a, b) => dateValue(a.date) - dateValue(b.date)))
    .then(events => {
      const pbps = events
        .filter(res => testDateIfCompleted(res.date))
        .map(event => getPlayByPlays(event))

      // const csvFilePath = `./tmp/${getYMD()}/${args.season}-plays.csv`
      return Promise.all(pbps)
        .then(res_1 => res_1.flat(2).map(e => flattenObject(e)))
        .then(json => createAndWrite(`./tmp/${getYMD()}/${args.season}-plays.csv`, getCSVString(json)))
        .catch(err => console.error('ERROR', err))
    })
    .catch(err => console.error('ERROR', err))
}
console.log('testing')
createPlayByPlays(argv)
