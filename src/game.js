const { api, teams, Request, _requests } = require('../')

const {
  mapObjArrays,
  parseRefId,
  cleanRef
} = require('./utils')

const defaultCallbacks = {
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
    return { consensus: rest }
  }

}

class Game {
  constructor(gameId) {
    this.gameId = gameId
    this.promises = getPromises(gameId)
    this.request = new Request('game')
    this.urls = api.Game(gameId)

    this.callbackFor = {}
    this.callbackFor.Probabilities = defaultCallbacks.Probabilities
  }

  getPlays(cb) {
    return this.request.getData(
      this.urls.plays,
      `${this.gameId}/plays.json`,
      cb)
  }

  getPromises(gameId) {
    const apiUrl = api.Game(gameId)

    const promises = [
      [apiUrl.plays, `${gameId}/plays.json`, callbacks.Plays],
      [apiUrl.probabilities, `${gameId}/probabilities.json`, callbacks.Probabilities],
      [apiUrl.h2h, `${gameId}/h2h.json`, callbacks.H2H],
      [apiUrl.oddsConsensus, `${gameId}/consensus.json`, callbacks.Consensus]
    ]

    return _requests.game
      .loadRequests(promises)
      .then(res_1 => res_1.reduce((a, b) => Object.assign(a, b), {}))
      .catch(err => console.error(err))
  }
}

// Game.prototype.setCallback = function (key, cb) {

const callbacks = defaultCallbacks

function getGameData(gameId) {
  const gameApi = api.Game(gameId)

  const gamePromises = [
    [gameApi.plays, `${gameId}/plays.json`, callbacks.Plays],
    [gameApi.probabilities, `${gameId}/probabilities.json`, callbacks.Probabilities],
    [gameApi.h2h, `${gameId}/h2h.json`, callbacks.H2H],
    [gameApi.oddsConsensus, `${gameId}/consensus.json`, callbacks.Consensus]
  ]

  return _requests.game
    .loadRequests(gamePromises)
    .then(res_1 => res_1.reduce((a, b) => Object.assign(a, b), {}))
    .catch(err => console.error(err))
}

module.exports = getGameData
