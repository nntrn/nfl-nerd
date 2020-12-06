const teams = require('../teams')
const teamRoster = require('../../data/roster')
const getGameData = require('../game')
const { mapObjArrays } = require('../utils')

const _roster = mapObjArrays(teamRoster, 'id', 'name')

function getRosterName(id) {
  return _roster.has(id) ? _roster.get(id) : id
}

const fmtText1Line = (str) => str.split(/\r?\n/g).join(' ')

async function getCompletedGames(event) {
  const { gameId, date } = event
  const _gameDate = date.split(/[\,\s]+/g)[0]

  return getGameData(gameId)
    .then(res => {
      const { plays, probabilities } = res
      const getProbabilities = mapObjArrays(probabilities, 'playId')
      return plays.map(pl => ({ ...pl, ...getProbabilities.get(pl.playId) }))
    })
    .then(response => response.map(res => {
      const {
        gameId = '', playId = '', field = {}, clock = '15:00', statYardage = 0,
        awayWinPercentage = 0, homeWinPercentage = 0, type = '', shortText = '',
        alternativeText = '', shortAlternativeText = '', scoreValue = 0,
        awayScore = 0, homeScore = 0, period = 0, scoringPlay = '', team = '',
        start = {}, end = {}, wallclock = '', participants = []
      } = res

      const driveTeam = teams.getTeam(team)
      const fieldIndex = Object.values(field).indexOf(driveTeam)

      return {
        gameId : `G${gameId}`,
        playId : `P${playId}`,
        type   : type.text,
        name   : Object.values(field).join(' @ '),
        date   : _gameDate,

        text: {
          short            : fmtText1Line(shortText),
          alternative      : fmtText1Line(alternativeText),
          shortAlternative : fmtText1Line(shortAlternativeText)
        },

        awayScore   : awayScore,
        homeScore   : homeScore,
        scoringPlay : scoringPlay,
        start       : start,
        end         : end,
        statYardage : statYardage,
        scoreValue  : (scoreValue === 6 && /Kick\)$/.test(shortText)) ?
          scoreValue + 1 : scoreValue,

        period     : period.number,
        clock      : clock.displayValue,
        clockValue : clock.value,

        timeElapsed: period.number > 0 ?
          ((period.number - 1) * 900) + (900 - clock.value) : 900 - clock.value,

        team  : driveTeam,
        opp   : Object.values(field).filter(s => s !== driveTeam)[0],
        field : Object.keys(field)[fieldIndex],

        currentTeamWinPct: [awayWinPercentage, homeWinPercentage][fieldIndex],

        teamScore : fieldIndex === 1 ? homeScore : awayScore,
        oppScore  : fieldIndex === 1 ? awayScore : homeScore,

        participants: {
          scorer     : '',
          rusher     : '',
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

module.exports = getCompletedGames
