const { waterfall } = require('async')
const teamRoster = require('../../data/roster')
const events = require('../../data/events')
const { Request, api, teams } = require('../..')

const {
  createAndWrite,
  dateValue,
  parseRefId,
  cleanRef,
  mapObjArrays,
  getCSVString
} = require('../utils')

function getYesterday() {
  return (new Date()).setDate(new Date().getDate() - 1)
}

function getRegGameIds(_team) {
  return events
    .filter(e => e.seasontype === 2)
    .filter(event => dateValue(event.date) < dateValue(getYesterday()))
    .filter(event => _team === 'all' ? true : event.name.indexOf(_team) > -1)
}

const _roster = mapObjArrays(teamRoster, 'id', 'name')

function getRosterName(id) {
  return _roster.has(id) ? _roster.get(id) : id
}

function cbProb(probabilities) {
  return probabilities.items.map(e => ({
    playId            : parseRefId(e.$ref, 'probabilities'),
    homeWinPercentage : e.homeWinPercentage,
    awayWinPercentage : e.awayWinPercentage
  }))
}

function cbPbp(plays) {
  if(Number(this.teamId) === -1) {
    return plays.items.map(e => ({ ...this.props, ...e }))
  }
  return plays.items
    .filter(e => parseRefId(e.team.$ref, 'teams') === this.teamId)
    .map(e => ({ ...this.props, ...e }))
}

function getPbpGames(ops) {

  const teamsFetch = [ops.teams].flat(2)

  teamsFetch.forEach(team => {
    var playRequest = []
    var probRequest = []

    const thisTeam = team

    getRegGameIds(thisTeam).forEach(game => {
      if([...teams.all, 'all'].includes(thisTeam)) {
        const _teamId = thisTeam === 'all' ? -1 : teams.getId(thisTeam)

        debugger
        playRequest.push([
          api.game_plays(game.gameId),
          `${game.gameId}/plays.json`,
          cbPbp.bind({ teamId: _teamId.toString(), props: game })
        ])

        debugger
        probRequest.push([
          api.game_probabilities(game.gameId),
          `${game.gameId}/probabilities.json`,
          cbProb
        ])
      }
    })

    const game = new Request('game')

    waterfall([
      // fetch probabilities
      function (callback) {
        game.loadRequests(probRequest).then(res => callback(null, mapObjArrays(res, 'playId')))
      },
      // combine win probabilities with detailed play by plays
      function (probabilities, callback) {
        game.loadRequests(playRequest)
          .then(res => res.map(pbp => {
            const {
              $ref, id, clock, modified, lastModified, participants = [], period, priority,
              probability, alternativeText = '', shortText = '', shortAlternativeText = '',
              scoreValue, seasontype, sequenceNumber, wallclock, year,
              type = { text: '', abbreviation: '' }, ...rest
            } = pbp

            const wpct = { awayWinPercentage: '', homeWinPercentage: '', ...probabilities.get(id) }
            const driveTeam = teams.getTeam(parseRefId(pbp.team.$ref, 'teams'))
            const fieldIndex = pbp.name.split(' @ ').indexOf(driveTeam)

            return {
              gameId     : parseRefId($ref, 'events'),
              playId     : id,
              type       : type.text,
              typeAbbr   : type.abbreviation,
              ...rest,
              scoreValue : (scoreValue === 6 && /Kick\)$/.test(shortText)) ? scoreValue + 1 : scoreValue,
              clock      : clock.displayValue,
              clockValue : clock.value,
              period     : period.number,

              elapsed: period.number > 0 ?
                ((period.number - 1) * 900) + (900 - clock.value) :
                900 - clock.value,

              opp               : pbp.name && pbp.name.split(' @ ').filter(s => s !== driveTeam)[0],
              team              : driveTeam,
              currentTeamWinPct : [wpct.awayWinPercentage, wpct.homeWinPercentage][fieldIndex],

              text: {
                short            : shortText.split(/\r?\n/g).join(' '),
                alternative      : alternativeText.split(/\r?\n/g).join(' '),
                shortAlternative : shortAlternativeText.split(/\r?\n/g).join(' ')
              },
              participants: {
                rusher     : '',
                scorer     : '',
                receiver   : '',
                passer     : '',
                tackler    : '',
                penalized  : '',
                assistedBy : '',
                ...participants
                  .map(p => ({ [p.type]: getRosterName(parseRefId(p.athlete.$ref, 'athletes')) }))
                  .reduce((a, b) => Object.assign(a, b), {})
              }
            }
          }))
          .then(plays => plays.map(e => cleanRef(e)))
          .then(res_1 => {
            createAndWrite(`${ops.out}/data/json/${thisTeam}.json`, res_1)
            createAndWrite(`${ops.out}/data/csv/${thisTeam}.csv`, getCSVString(res_1))
            return res_1
          })
          .then(res_2 => callback(null, res_2))
          .catch(err => console.log(err))
      }
    ],

    function (err, result) {
      console.log(result.slice(0, 1))
    })

  })

}
module.exports = getPbpGames
