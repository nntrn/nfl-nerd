const { Request, api } = require('..')

function apiDateFmt(date) {
  return [
    date.getUTCFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ].join('')
}

// returns the closest thursday, sunday, or monday
function nextGameDay() {
  var dt = new Date()
  var gameDays = [0, 1, 4]

  while(!gameDays.includes(dt.getDay())) {
    dt.setDate(dt.getDate() + 1)
  }
  return dt
}

async function getGames() {
  const gameDate = apiDateFmt(nextGameDay())
  const scheduleRequest = new Request('upcoming-games')

  return scheduleRequest
    .getData(api.scoreboard(gameDate), `${gameDate}.json`, function (cb) {
      return cb.events
    })
}

module.exports.getGames = getGames
