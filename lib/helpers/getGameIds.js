class Games {

  constructor() {

  }
}

function getGames(team) {
  const yesterday = (new Date()).setDate(new Date().getDate() - 1)
  return schedule
    .filter(e => e.name.indexOf(team) > -1)
    .filter(e => dateValue(e.date) < dateValue(yesterday))
    .map(e => e.gameId)
}

function getGameIds(team) {
  if(Array.isArray(team)) {
    return team.map(e => getGames(e)).flat()
  }
  return getGames(team)
}

module.exports = getGameIds
