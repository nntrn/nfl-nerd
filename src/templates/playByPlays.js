const fmtText1Line = (str) => str.toString().split(/\n/g).join(' ')
const toPrecision = (num) => Number(Number(num).toPrecision(4))
const getAthlete = require('../getters/getAthlete')

// function participantsObj(res = []) {
//   var obj = {}
//   if(Array.isArray(res) && res.length > 0) {
//     obj = res
//       .map(p => ({ [p.type]: getAthlete(p.athlete) }))
//       .reduce((a, b) => Object.assign(a, b), {})
//   }
//   return {
//     scorer     : '', rusher     : '', receiver   : '', passer     : '',
//     tackler    : '', penalized  : '', assistedBy : '',
//     ...obj
//   }
// }

const template = {
  gameId              : '',
  playId              : '',
  name                : '',
  date                : '',
  field               : {},
  team                : '',
  clock               : { value: -1, displayValue: '15:00' },
  type                : { text: '', abbreviation: '' },
  period              : { number: 0 },
  scoringPlay         : '',
  scoreValue          : 0,
  statYardage         : 0,
  team                : '',
  opp                 : '',
  start               : {},
  end                 : {},
  scoreValue          : 0,
  timeElapsed         : 0,
  field               : '',
  // awayWinPercentage    : toPrecision,
  // homeWinPercentage    : toPrecision,
  curTeamWinPct       : toPrecision,
  oppTeamWinPct       : toPrecision,
  teamScore           : 0,
  oppScore            : 0,
  wallclock           : '',
  text                : fmtText1Line,
  shortText           : fmtText1Line,
  alternativeText     : fmtText1Line,
  shortAlternativeText: fmtText1Line,
  participants        : []
}

module.exports = template
