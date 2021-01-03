const teams = require('../teams')
const getAllGameRelated = require('./getAllGameRelated')
const getAthlete = require('./getAthlete')
const { mapObjArrays, deepUpdateObject } = require('../utils')
const defaultTemplate = require('../templates/playByPlays')

const defaultProbabilities = {
  playId            : '',
  awayWinPercentage : 0,
  homeWinPercentage : 0,
  field             : {
    away : '',
    home : ''
  }
}

async function getPlayByPlays(event) {
  const { gameId, date } = event
  const dt = (new Date(date))

  return getAllGameRelated(gameId)
    .then(res => {
      const { plays = [], probabilities = []} = res
      const prob = mapObjArrays(probabilities, 'playId')
      return plays.map(play => ({
        ...play,
        ...(Object.keys(probabilities).length && prob.has(play.id) ?
          prob.get(play.id) : defaultProbabilities),
      }))
    })
    .then(response => response.map(res => {
      const { awayWinPercentage = 0, homeWinPercentage = 0 } = res
      const driveTeam = teams.getTeam(res.team) || ''
      const fieldIndex = Object.values(res.field).indexOf(driveTeam)

      const updated = deepUpdateObject(defaultTemplate, {
        ...res,
        name          : Object.values(res.field).join(' @ '),
        date          : dt.toISOString().split('T')[0],
        team          : driveTeam,
        opp           : Object.values(res.field).filter(team => team !== driveTeam)[0],
        field         : Object.keys(res.field)[fieldIndex],
        curTeamWinPct : [awayWinPercentage, homeWinPercentage][fieldIndex],
        oppTeamWinPct : [homeWinPercentage, awayWinPercentage][fieldIndex],
        teamScore     : fieldIndex === 1 ? res.homeScore : res.awayScore,
        oppScore      : fieldIndex === 1 ? res.awayScore : res.homeScore,
        scoreValue    : (res.scoreValue === 6 && /Kick\)$/.test(res.shortText)) ?
          res.scoreValue + 1 : res.scoreValue,
        timeElapsed: res.period.number > 0 ?
          ((res.period.number - 1) * 900) + (900 - res.clock.value) :
          900 - res.clock.value,
      })

      return {
        ...updated,
        participants: {
          scorer     : '', rusher     : '', receiver   : '', passer     : '',
          tackler    : '', penalized  : '', assistedBy : '',
          ...(res.participants || [])
            .map(p => ({ [p.type]: getAthlete(p.athlete) }))
            .reduce((a, b) => Object.assign(a, b), {})
        }
      }
    }))
    .catch(err => console.error('ERROR', err))
}

module.exports = getPlayByPlays
