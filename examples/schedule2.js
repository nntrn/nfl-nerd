// run `node examples/schedule2` in CLI to get output

const fs = require('fs')
const nerd = require('../lib')

nerd
  .getGameIdsForSeason(2016)
  .then(data => {
    fs.writeFileSync(
      './examples/games-2016.json',
      JSON.stringify(data, null, 2)
    )
  })
