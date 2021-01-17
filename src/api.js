const { getCurrentSeason } = require('./utils')

const _PROTOCOL = 'https://'
const _site = _PROTOCOL + 'site.api.espn.com/apis/site/v2/sports/football/nfl'
const _web = _PROTOCOL + 'site.web.api.espn.com/apis/common/v3/sports/football/nfl'
const _core = _PROTOCOL + 'sports.core.api.espn.com/v2/sports/football/leagues/nfl'

const Athlete = (athleteId) => ({
  bio      : `${_web}/athletes/${athleteId}/bio`,
  gamelog  : `${_web}/athletes/${athleteId}/gamelog`,
  main     : `${_core}/athletes/${athleteId}`,
  overview : `${_web}/athletes/${athleteId}/overview`,
  stats    : `${_web}/athletes/${athleteId}/stats`,

  getProjections : (season) => `${_core}/seasons/${season}/types/2/athletes/${athleteId}/projections`,
  getSeason      : (season) => `${_core}/seasons/${season}/types/2/athletes/${athleteId}`,
  getStat        : (season) => `${_core}/seasons/${season}/types/2/athletes/${athleteId}/statistics`
})

const Game = (gameId) => ({
  h2h           : `${_core}/events/${gameId}/competitions/${gameId}/odds/1002/head-to-heads`,
  odds          : `${_core}/events/${gameId}/competitions/${gameId}/odds`,
  oddsConsensus : `${_core}/events/${gameId}/competitions/${gameId}/odds/1004`,
  plays         : `${_core}/events/${gameId}/competitions/${gameId}/plays?limit=500`,
  predictor     : `${_core}/events/${gameId}/competitions/${gameId}/predictor`,
  probabilities : `${_core}/events/${gameId}/competitions/${gameId}/probabilities?limit=500`,
  summary       : `${_site}/summary?event=${gameId}`,

  getRecords : (teamId) => `${_core}/events/${gameId}/competitions/${gameId}/competitors/${teamId}/records`,
  getRoster  : (teamId) => `${_core}/events/${gameId}/competitions/${gameId}/competitors/${teamId}/roster`
})

const Team = (teamId) => ({
  ats              : `${_core}/seasons/${getCurrentSeason()}/types/2/teams/${teamId}/ats`,
  odds             : `${_core}/seasons/${getCurrentSeason()}/types/2/teams/${teamId}/odds-records`,
  pastPerformances : `${_core}/seasons/${getCurrentSeason()}/types/2/teams/${teamId}/odds/1002/past-performances?limit=300`,
  projection       : `${_core}/seasons/${getCurrentSeason()}/teams/${teamId}/projection`,
  roster           : `${_site}/teams/${teamId}?enable=roster,projection,stats`,
  roster2          : `${_site}/teams/${teamId}/roster`,
  schedule         : `${_site}/teams/${teamId}/schedule`,
  statistics       : `${_core}/seasons/${getCurrentSeason()}/types/2/teams/${teamId}/statistics`
})

module.exports = {
  athlete          : (athleteId) => `${_web}/athletes/${athleteId}`,
  athlete_bio      : (athleteId) => `${_web}/athletes/${athleteId}/bio`,
  athlete_overview : (athleteId) => `${_web}/athletes/${athleteId}/overview`,
  athlete_gamelog  : (athleteId) => `${_web}/athletes/${athleteId}/gamelog`,
  athlete_stats    : (athleteId) => `${_web}/athletes/${athleteId}/stats`,
  athlete_splits   : (athleteId, props) => `${_web}/athletes/${athleteId}/splits?${qs.stringify(props)}`,

  leaders          : (props) => `${_web}/leaders?${qs.stringify(props)}`,
  seasons          : (year) => `${_site}/scoreboard?limit=400&dates=${year}0901-${(+year) + 1}0201`,
  // seasonMapper
  scoreboard       : (...dates) => `${_site}/scoreboard?limit=400&dates=${dates.join('-')}`,
  scoreboard2      : (dates) => `${_site}/scoreboard?limit=400&dates=${dates.join('-')}`,
  summary          : (gameId) => `${_site}/summary?event=${gameId}`,
  team             : (teamId) => `${_site}/teams${teamId ? `/${teamId}` : ''}`,
  teams            : (args) => `${_site}/teams${args ? '?' + qs.stringify(args) : ''}`,
  team_schedule    : (teamId) => `${_site}/teams/${teamId}/schedule`,
  team_roster      : (teamId) => `${_site}/teams/${teamId}/roster`,
  team_odds_record : (teamId) => `${_core}/seasons/2020/types/2/teams/${teamId}/odds-records`,

  game_probabilities : (gameId) => `${_core}/events/${gameId}/competitions/${gameId}/probabilities?limit=500`,
  game_plays         : (gameId) => `${_core}/events/${gameId}/competitions/${gameId}/plays?limit=500`,
  game_odds          : (gameId) => `${_core}/events/${gameId}/competitions/${gameId}/odds`,
  game_predictor     : (gameId) => `${_core}/events/${gameId}/competitions/${gameId}/predictor`,
  game_roster        : (gameId, teamId) => `${_core}/events/${gameId}/competitions/${gameId}/competitors/${teamId}/roster`,
  game_h2h           : (gameId) => `${_core}/events/${gameId}/competitions/${gameId}/odds/1002/head-to-heads`,
  game               : (gameId) => (endpoint) => `${_core}/events/${gameId}/competitions/${gameId}/${endpoint}`,
}

module.exports.Game = Game
module.exports.Athlete = Athlete
module.exports.Team = Team
