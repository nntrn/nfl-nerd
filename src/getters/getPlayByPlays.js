const teams = require('../teams')
const teamRoster = require('../../data/roster')
const getGameData = require('../game')
const { mapObjArrays } = require('../utils')

const _roster = mapObjArrays(teamRoster, 'id', 'name')

function getRosterName(id) {
  return _roster.has(id) ? _roster.get(id) : id
}

const fmtText1Line = (str) => str.split(/\r?\n/g).join(' ')

async function getGame() {

  const gamePromises = [
    [api.Game(gameId).plays, `${gameId}/plays.json`, callbacks.Plays],
    [api.Game(gameId).probabilities, `${gameId}/probabilities.json`, callbacks.Probabilities],
  ]

  return _requests.game
    .loadRequests(gamePromises)
    .then(res_1 => res_1.reduce((a, b) => Object.assign(a, b), {}))
    .catch(err => console.error(err))
}

async function getPlayByPlays(gameId) {
  return getGameData(gameId)
    .then(res => {
      const { plays, probabilities } = res
      const getProbabilities = mapObjArrays(probabilities, 'playId')
      return plays.map(pl => ({ ...pl, ...getProbabilities.get(pl.playId) }))
    })
    .then(response => response.map(res => {
      const {
        gameId = '', playId = '', field = {}, clock = '', statYardage = '',
        awayWinPercentage = 0, homeWinPercentage = 0, type = '', shortText = '',
        alternativeText = '', shortAlternativeText = '', scoreValue = 0,
        awayScore = 0, homeScore = 0, period = 0, scoringPlay = '', team = '',
        start = {}, end = {}, wallclock = '', participants = []
      } = res

      const driveTeam = teams.getTeam(team)
      const fieldIndex = Object.values(field).indexOf(driveTeam)

      return {
        gameId : gameId,
        playId : JSON.stringify(playId),
        type   : type.text,
        name   : Object.values(field).join(' @ '),
        text   : {
          short            : fmtText1Line(shortText),
          alternative      : fmtText1Line(alternativeText),
          shortAlternative : fmtText1Line(shortAlternativeText)
        },
        awayScore   : awayScore,
        homeScore   : homeScore,
        scoringPlay : scoringPlay,
        team        : driveTeam,
        start       : start,
        end         : end,
        statYardage : statYardage,
        scoreValue  : (scoreValue === 6 && /Kick\)$/.test(shortText)) ?
          scoreValue + 1 : scoreValue,
        clock      : clock.displayValue,
        clockValue : clock.value,
        wallclock  : wallclock,
        period     : period.number,
        wallclock  : wallclock,
        elapsed    : period.number > 0 ?
          ((period.number - 1) * 900) + (900 - clock.value) :
          900 - clock.value,

        opp               : Object.values(field).filter(s => s !== driveTeam)[0],
        currentTeamWinPct : [awayWinPercentage, homeWinPercentage][fieldIndex],
        field             : Object.keys(field)[fieldIndex],

        participants: {
          rusher     : '',
          scorer     : '',
          receiver   : '',
          passer     : '',
          tackler    : '',
          penalized  : '',
          assistedBy : '',
          ...participants
            .map(p => ({ [p.type]: getRosterName(p.athlete) }))
            .reduce((a, b) => Object.assign(a, b), {})
        }
      }
    }))
    .then(res => res)
    .catch(err => console.log('ERROR', err))
}

module.exports = getPlayByPlays
