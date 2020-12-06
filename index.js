const api = require('./src/api')
const teams = require('./src/teams')
const Request = require('./src/request')

module.exports = {
  teams,
  api,
  Request,
  _requests: {
    game: new Request('game'),
    nfl: new Request('nfl'),
    schedule: new Request('schedule'),
    stats: new Request('stats'),
    teams: new Request('teams'),
  }
}

