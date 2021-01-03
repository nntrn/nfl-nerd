const api = require('./src/api')
const teams = require('./src/teams')
const Request = require('./src/request')

module.exports = {
  teams,
  api,
  Request,

  gameRequest: new Request('game'),
  nflRequest: new Request('nfl'),
  scheduleRequest: new Request('schedule'),
  statsRequest: new Request('stats'),
  teamsRequest: new Request('teams'),
}

