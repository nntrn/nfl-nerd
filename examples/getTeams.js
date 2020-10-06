const { getTeams } = require('../src/getTeams')
const { createAndWrite } = require('../src/utils')

getTeams()
  .then(t => createAndWrite('./tmp/teams.json', JSON.stringify(t, null, 2)))
