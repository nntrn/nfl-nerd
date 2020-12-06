const { teams, _requests } = require('../../index')
const { Team } = require('../api')

function cb(req) {
  return req.team.athletes.map(e => ({ ...e, team: this.team }))
}

function getRoster(callback = cb) {
  const teamRequests = []
  teams.teams.forEach(team => {
    teamRequests.push([
      Team(team.teamId).roster,
      `roster/${team.teamAbbr}.json`,
      callback.bind({ team: team.teamAbbr })
    ])
  })
  return _requests.teams.loadRequests(teamRequests)
}

module.exports = getRoster

