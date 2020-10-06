const { createAndWrite } = require('../src/utils')
const dl = require('../vendor/datalib')

const teams = ['ATL', 'GB']

teams.forEach(team => {
  const pbpPath = `${__dirname}/pbp/${team}`
  let teamData = require(pbpPath)

  teamData = teamData.data
    .filter(e => e.driveScoringPlay)
    .map(e => {
      const {
        // filtering out the following:
        driveId,
        playAwayScore,
        playClockDisplayValue,
        playEndDistance,
        playEndDown,
        playEndDownDistanceText,
        playEndPossessionText,
        playEndShortDownDistanceText,
        playEndTeamId,
        playEndYardLine,
        playEndYardsToEndzone,
        playHomeScore,
        playModified,
        playPeriodNumber,
        playPriority,
        playStartDistance,
        playStartDown,
        playStartDownDistanceText,
        playStartPossessionText,
        playStartShortDownDistanceText,
        playStartTeamId,
        playStartYardLine,
        playStartYardsToEndzone,
        playTypeAbbreviation,
        playTypeId,
        playWallclock,
        // we only want:
        ...rest
      } = e

      return {
        ...rest,
        isSelectedTeam: e.driveTeam === team ? true : false,
      }
    })

  const dlGroupby = dl.
    groupby('isSelectedTeam').execute(teamData)
    .map(e => ({ ...e, playTypeText: dl.groupby('playTypeText').execute(e.values) }))

  createAndWrite(`${__dirname}/out/getTeamStat/${team}.json`, JSON.stringify(dlGroupby, null, 2))

})
