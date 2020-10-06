const fetch = require('node-fetch')
const fs = require('fs')
const config = require('../config')
const { getMe, flattenObjectCamel, createAndWrite } = require('./utils')

function getPlays(drives) {
  const awayTeam = getMe('boxscore.teams.0.team', drives)
  const homeTeam = getMe('boxscore.teams.1.team', drives)
  const gameName = [awayTeam.abbreviation, homeTeam.abbreviation].join(' vs. ')

  const firstScoringPlay = getMe('scoringPlays.0.id', drives)
  let firstTDId

  for(var play of drives.scoringPlays) {
    if(play.type.abbreviation === 'TD') {
      firstTdId = play.id
      break
    }
  }

  return drives.drives.previous
    .map(e => e.plays.map(play => ({
      playId  : '#',
      gameId  : this.gameId,
      driveId : e.id,
      qtr     : 'Q' + e.start.period.number,
      title   : gameName,

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

async function getPlayByPlay(gameId, getPbpCb = getPlays) {
  this.gameId = gameId
  // look for local summary
  const localFile = `${config.cache}/summary/drives/${gameId}.json`

  if(fs.existsSync(localFile)) {
    console.log('reading local ', gameId)
    return getPbpCb(require(localFile))
  }

  // fetch from espn if not stored locally
  return fetch(`${config.espn.summary}?event=${gameId}`)
    .then((resp) => resp.json())
    .then((drives) => {
      // only write to local if game is finished
      if(getMe('header.competitions.0.playByPlaySource', drives) === 'full') {
        console.log('saved local summary of ' + gameId)
        createAndWrite(localFile, JSON.stringify(drives))
      }
      return getPbpCb(drives)
    })

}

module.exports.getPlayByPlay = getPlayByPlay
