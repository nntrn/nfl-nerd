const getSeasonGames = require('../src/getters/getSeasonGames')
const { createAndWrite, dateValue, jsParser } = require('../src/utils')

getSeasonGames()
  .then(res => {
    const sortedGames = res.sort((a, b) => dateValue(a.date) - dateValue(b.date))
    createAndWrite('./data/events.js', jsParser(sortedGames))
  })

