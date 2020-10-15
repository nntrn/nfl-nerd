const nflnerd = require('../index')
const config = require('../config')

const dateToday = (new Date()).toLocaleDateString('en-US')

const { createAndWrite, createCSV } = require('../src/utils')

// get value of date
const dv = (dateString) => (new Date(dateString)).valueOf()

async function getGamesToday() {
  const schedule = await nflnerd.getSchedule(2020)
  const nextGame = await schedule.filter(e => dv(e.date) >= dv(dateToday)).slice(0, 1)

  const teams = nextGame.map(e => e.name.split(' @ '))[0]

  const [awayTeam, homeTeam] = teams

  const playsData = {
    nextGame: nextGame,
    data: {
      [awayTeam]: [],
      [homeTeam]: []
    }
  }

  teams.forEach(team => {
    const temp = require(`../data/pbp/2020/${team}`)

    const teamData = temp.data
      .filter(e => e.playScoringPlay)
      .map(e => ({
        team: e.driveTeam,
        qtr: e.qtr,
        clock: e.playClockDisplayValue,
        text: JSON.stringify(e.playText),
        type: e.playTypeAbbreviation,
        playType: e.playTypeText,
        firstScoringPlay: e.firstScoringPlay,
        firstTD: e.firstTD,
        period: e.playPeriodNumber,
        startYdLine: e.playStartYardLine,
        endYdLine: e.playEndYardLine,
        driveResult: e.driveResult,
        partOf: team,
        target: team === e.driveTeam ? true : false
      }))
      .sort((a, b) => a.qtr.localeCompare(b.qtr))

    Object.assign(playsData.data, {
      [team]: teamData
    })

  })

  createAndWrite(
    `${config.dirname}/examples/out/${dateToday.replace(/\//g, '-')}.json`,
    JSON.stringify(playsData, null, 2)
  )

  createAndWrite(
    `${config.dirname}/examples/out/${dateToday.replace(/\//g, '-')}.csv`,
    createCSV(Object.values(playsData.data).flat())
  )

}

getGamesToday()
