const { teams, teamsRequest } = require('../../index')
const { Team } = require('../api')

function cb(req) {
  return req.team.athletes.map(e => ({ ...e, team: this.team }))
}

function getRoster(callback = cb) {
  const teamRequests = []
  teams.teams.forEach(team => {
    teamRequests.push([
      Team(team.teamId).roster,
      `tmp/${(new Date()).toISOString().split('T')[0]}/roster/${team.teamAbbr}.json`,
      callback.bind({ team: team.teamAbbr })
    ])
  })
  return teamsRequest.loadRequests(teamRequests)
}

module.exports = getRoster

