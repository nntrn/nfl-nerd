const teams = [
  { teamId: '1', teamAbbr: 'ATL' },
  { teamId: '2', teamAbbr: 'BUF' },
  { teamId: '3', teamAbbr: 'CHI' },
  { teamId: '4', teamAbbr: 'CIN' },
  { teamId: '5', teamAbbr: 'CLE' },
  { teamId: '6', teamAbbr: 'DAL' },
  { teamId: '7', teamAbbr: 'DEN' },
  { teamId: '8', teamAbbr: 'DET' },
  { teamId: '9', teamAbbr: 'GB' },
  { teamId: '10', teamAbbr: 'TEN' },
  { teamId: '11', teamAbbr: 'IND' },
  { teamId: '12', teamAbbr: 'KC' },
  { teamId: '13', teamAbbr: 'OAK' },
  { teamId: '14', teamAbbr: 'LAR' },
  { teamId: '15', teamAbbr: 'MIA' },
  { teamId: '16', teamAbbr: 'MIN' },
  { teamId: '17', teamAbbr: 'NE' },
  { teamId: '18', teamAbbr: 'NO' },
  { teamId: '19', teamAbbr: 'NYG' },
  { teamId: '20', teamAbbr: 'NYJ' },
  { teamId: '21', teamAbbr: 'PHI' },
  { teamId: '22', teamAbbr: 'ARI' },
  { teamId: '23', teamAbbr: 'PIT' },
  { teamId: '24', teamAbbr: 'LAC' },
  { teamId: '25', teamAbbr: 'SF' },
  { teamId: '26', teamAbbr: 'SEA' },
  { teamId: '27', teamAbbr: 'TB' },
  { teamId: '28', teamAbbr: 'WSH' },
  { teamId: '29', teamAbbr: 'CAR' },
  { teamId: '30', teamAbbr: 'JAX' },
  { teamId: '33', teamAbbr: 'BAL' },
  { teamId: '34', teamAbbr: 'HOU' }
]

module.exports = {
  teams : teams,
  all   : teams.map(e => e.teamAbbr),

  getTeam(id) {
    return teams.filter(e => e.teamId === id).map(e => e.teamAbbr)[0]
  },
  getId(abbr) {
    return teams.filter(e => e.teamAbbr === abbr).map(e => e.teamId)[0]
  }
}
