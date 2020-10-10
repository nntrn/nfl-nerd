const fetch = require('node-fetch')

const config = require('../config')
const { getMe, flattenObjectCamel, createAndWrite, existsSync } = require('./utils')

function getPlays(drives) {
  const awayTeam = getMe('boxscore.teams.team', drives)[0]
  const homeTeam = getMe('boxscore.teams.team', drives)[1]

  const firstScoringPlay = getMe('scoringPlays.id', drives)[0]
  let firstTDId

  for(var play of drives.scoringPlays) {
    if(play.type.abbreviation === 'TD') {
      firstTDId = play.id
      break
    }
  }
  return drives.drives.previous
    .map(e => e.plays.map(play => ({
      playId  : '#',
      gameId  : drives.header.id,
      driveId : e.id,
      qtr     : 'Q' + e.start.period.number,
      title   : [awayTeam.abbreviation, homeTeam.abbreviation].join(' vs. '),

      ...flattenObjectCamel({
        drive: {
          team        : e.team.abbreviation,
          scoringPlay : e.isScore,
          result      : e.result
        },
        first: {
          TD          : play.id === firstTDId ? true : false,
          scoringPlay : play.id === firstScoringPlay ? true : false,
        },
        play: play
      }),
    })))
    .flat()
}

async function getPlayByPlay(gameId, cb = getPlays) {
  // look for local summary

  const localFile = `${config.cache}/summary/drives/${gameId}.json`

  if(existsSync(localFile)) {
    console.log('reading local ', gameId)
    return cb(require(localFile))
  }

  // fetch from espn if not stored locally
  return fetch(`${config.espn.summary}?event=${gameId}`)
    .then((resp) => resp.json())
    .then((drives) => {
      // only write to local if game is finished
      console.log('fetched', gameId)
      if(getMe('header.competitions.playByPlaySource', drives)[0] === 'full') {
        console.log('saved local summary of ' + gameId)
        createAndWrite(localFile, JSON.stringify(drives))
      }
      return cb(drives)
    })

}

module.exports.getPlayByPlay = getPlayByPlay
