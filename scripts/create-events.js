const getSeasonGames = require('../src/requests/season-games')
const { createAndWrite, dateValue, jsParser } = require('../src/utils')

getSeasonGames().then(res => {
  const sortedGames = res.sort((a, b) => dateValue(a.date) - dateValue(b.date))
  createAndWrite('./data/events.js',
    [
    `// created from ${path.relative(process.cwd(), __filename)}`,,
      jsParser(sortedGames)
    ].join('\n'))
})

