const { getTeams } = require('../src/getTeams')
const { createAndWrite } = require('../src/utils')

getTeams()
  .then(t => createAndWrite('./tmp2/teams-cache.json', JSON.stringify(t, null, 2)))
