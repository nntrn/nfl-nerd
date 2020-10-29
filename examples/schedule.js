// run `node examples/schedule` in CLI to get output

const fs = require('fs')
const Schedule = require('../lib/helpers/schedule')

console.log(Schedule.getCurrentSeason())

const schedule2019 = Schedule.getUrls({ year: 2019 })
console.log(schedule2019)

const schedule2020 = Schedule.getUrls({ year: 2020 })
console.log(schedule2020)

Schedule.getGames()
  .then((games) => {
    fs.writeFileSync('./examples/games-2020.json', JSON.stringify(games, null, 2))
  })
