const path = require('path')
const getRoster = require('../../src/getters/getRoster')
const getSeasonGames = require('../../src/getters/getSeasonGames')
const { createAndWrite, jsParser, dateValue } = require('../../src/utils')

getRoster().then(res => {
  const rosterDat = res.map(e => ({
    id: e.id, name: e.displayName, position: e.position.abbreviation, team: e.team,
  }))

  createAndWrite('./data/roster.js', [
    `// created from ${path.relative(process.cwd(), __filename)}`,
    jsParser(rosterDat)
  ].join('\n'))
})

getSeasonGames().then(res => {
  createAndWrite('./data/events.js', [
    `// created from ${path.relative(process.cwd(), __filename)}`,,
    jsParser(res.sort((a, b) => dateValue(a.date) - dateValue(b.date)))
  ].join('\n'))
})
