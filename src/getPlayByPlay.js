const fetch = require('node-fetch')
const config = require('../config')

const { objectPicker, flattenObjectCamel, createAndWrite, existsSync, removeWithoutMutate } = require('./utils')

const logger = config.logger('pbp')

function getPlays(drives) {

  const [awayTeam, homeTeam] = objectPicker('boxscore.teams.team', drives)

  const firstScoringPlay = objectPicker('scoringPlays.id', drives)[0]
  let firstTDId

  for(var play of drives.scoringPlays) {
    if(play.type.abbreviation === 'TD') {
      firstTDId = play.id
      break
    }
  }

  const winprobability = objectPicker('winprobability', drives)

  return drives.drives.previous
    .map(e => e.plays.map(play => ({
      playId  : '#',
      gameId  : drives.header.id,
      driveId : e.id,
      qtr     : 'Q' + e.start.period.number,
      title   : [awayTeam.abbreviation, homeTeam.abbreviation].join(' vs. '),

      ...flattenObjectCamel({
        drive: {
          ...e,
          team        : e.team.abbreviation,
          scoringPlay : e.isScore,
          result      : e.result
        },
        first: {
          TD          : play.id === firstTDId ? true : false,
          scoringPlay : play.id === firstScoringPlay ? true : false,
        },
        play           : play,
        winProbability : winprobability.filter(w => w.playId === play.id)[0]
      }),
    })))
    .flat()
}

async function getPlayByPlay(gameId, cb = getPlays) {

  const localFile = `${config.cache}/summary/${gameId}.json`

  if(existsSync(localFile)) {
    logger.log('info', 'local file exists', { path: localFile })
    return cb(require(localFile))
  }

  const fetchURL = `${config.espn.summary}?event=${gameId}`

  return fetch(fetchURL)
    .then((response) => {
      if(response.ok) {
        logger.log('info', 'response is ok', { path: fetchURL, res: response })
        return response.json()
      } else {

        logger.log('error', 'Something went wrong', { path: fetchURL, res: response })

      }
    })
    .then((drives) => {
      const newDrives = removeWithoutMutate(drives, config.removeBeforeSave.summary)
      logger.log('info', `Fetched: ${fetchURL}`, { gameId: gameId })
      if(objectPicker('header.competitions.playByPlaySource', drives)[0] === 'full') {
        logger.log('info', `Saved local file: ${localFile}`, { gameId: gameId })
        createAndWrite(localFile, JSON.stringify(newDrives))
      }
      return cb(newDrives)
    }).catch((error) => {

      logger.log('error', error, { path: fetchURL })

    })

}

module.exports.getPlayByPlay = getPlayByPlay
