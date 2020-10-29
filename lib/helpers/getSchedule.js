const API = require('../urls')

const seasonWeeksEnum = {
  OFF  : 1,
  POST : 5,
  PRE  : 5,
  REG  : 17
}

const seasonValueEnum = {
  1 : 'PRE',
  2 : 'REG',
  3 : 'POST',
  4 : 'OFF'
}

const CURRENT_YEAR = (new Date()).getMonth() > 8 ?
  new Date().getFullYear() : (new Date().getFullYear() - 1)

function getScheduleURLS(props) {
  const ops = { year: CURRENT_YEAR, seasontype: 2, ...props }
  var weeks = seasonWeeksEnum.REG

  if(Number(ops.seasontype) > 0 && Number(ops.seasontype) < 5) {
    weeks = seasonWeeksEnum[seasonValueEnum[ops.seasontype]]
  }
  const urls = []
  for(var wk = 1; wk < weeks + 1; wk++) {
    urls.push(
      API.schedule({ year: ops.year, seasontype: ops.seasontype, week: wk })
    )
  }
  return urls
}

function getSchedule(json) {
  return Object.values(json.content.schedule).map(e => e.games).flat()
}

module.exports = {
  getScheduleURLS,
  getSchedule
}
