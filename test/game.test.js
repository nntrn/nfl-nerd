const teams = require('../src/teams')
const teamRoster = require('../data/roster')
const getGameData = require('../src/game')
const { createAndWrite, mapObjArrays } = require('../src/utils')

const _roster = mapObjArrays(teamRoster, 'id', 'name')

function getRosterName(id) {
  return _roster.has(id) ? _roster.get(id) : id
}

debugger
getGameData('401249063')
  .then(response => response.map(res => {
    const {
      gameId = '', playId = '', field = {}, clock = '', statYardage = '',
      awayWinPercentage = '', homeWinPercentage = '', type = '', shortText = '',
      alternativeText = '', shortAlternativeText = '', scoreValue = 0,
      awayScore = '', homeScore = '', period = 0, scoringPlay = '', team = '',
      start = '', end = '', participants = []
    } = res

    const driveTeam = teams.getTeam(team)
    const fieldIndex = Object.values(field).indexOf(driveTeam)

    debugger
    return {
      gameId: gameId,
      playId: playId,
      type: type.text,
      name: Object.values(field).join(' @ '),
      date: '',
      text: {
        short: shortText,
        alternative: alternativeText,
        shortAlternative: shortAlternativeText
      },
      awayScore: awayScore,
      homeScore: homeScore,
      scoringPlay: scoringPlay,
      team: driveTeam,
      start: start,
      end: end,
      statYardage: statYardage,
      scoreValue: (scoreValue === 6 && /Kick\)$/.test(shortText)) ?
        scoreValue + 1 : scoreValue,
      clock: clock.displayValue,
      clockValue: clock.value,
      period: period.number,

      elapsed: period.number > 0 ?
        ((period.number - 1) * 900) + (900 - clock.value) :
        900 - clock.value,

      opp: Object.values(field).filter(s => s !== driveTeam)[0],
      currentTeamWinPct: [awayWinPercentage, homeWinPercentage][fieldIndex],
      field: Object.keys(field)[fieldIndex],

      participants: {
        rusher: '',
        scorer: '',
        receiver: '',
        passer: '',
        tackler: '',
        penalized: '',
        assistedBy: '',
        ...participants
          .map(p => ({ [p.type]: getRosterName(p.athlete) }))
          .reduce((a, b) => Object.assign(a, b), {})
      }
    }
  }
  ))
  .catch(err => console.log('ERROR', err))
  .then(res => createAndWrite('./tmp/game2.text.json', JSON.stringify(res, null, 2)))

