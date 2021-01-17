const { api, teams, gameRequest } = require('../../')
const { parseRefId, cleanRef } = require('../utils')

const callbacks = {

  Probabilities: (res) => ({
    probabilities: res.items.map(e => ({
      playId            : parseRefId(e.$ref, 'probabilities'),
      awayWinPercentage : e.awayWinPercentage,
      homeWinPercentage : e.homeWinPercentage,
      field             : {
        away : teams.getTeam(parseRefId(e.awayTeam.$ref, 'teams')),
        home : teams.getTeam(parseRefId(e.homeTeam.$ref, 'teams')),
      }
    })) }),

  Plays: (res) => ({
    plays: res.items.map(play => ({
      gameId : parseRefId(play.$ref, 'events'),
      playId : parseRefId(play.$ref, 'plays'),
      ...play
    })).map(e => cleanRef(e))
  }),

  Roster: (res) => ({ roster: res.entries.map(e => cleanRef(e)) }),

  H2H: (res) => ({ h2h: res.items.map(e => cleanRef(e)) }),

  Consensus: (res) => {
    const { $ref, provider, ...rest } = res
    return { consensus: cleanRef(rest) }
  },

  Predictor: (res) => ({ predictor: cleanRef(res) })

}

function getAllGameRelated(gameId) {

  const { plays, probabilities, h2h, oddsConsensus, predictor } = api.Game(gameId)

  return gameRequest
    .loadRequests([
      [plays, `${gameId}/plays.json`, callbacks.Plays],
      [probabilities, `${gameId}/probabilities.json`, callbacks.Probabilities],
      [h2h, `${gameId}/h2h.json`, callbacks.H2H],
      [oddsConsensus, `${gameId}/consensus.json`, callbacks.Consensus],
      [predictor, `${gameId}/predictor.json`, callbacks.Predictor]
    ])
    .then(res_1 => res_1.reduce((a, b) => Object.assign(a, b), {}))
    .catch(err => console.log(gameId, err))
}

module.exports = getAllGameRelated
