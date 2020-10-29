function getPlaysByPlays(res) {
  if(res.header.competitions[0].status.type.name === 'STATUS_FINAL') {

    var win = res.winprobability
    var firstScoringPlay = res.scoringPlays[0].id
    var firstTDId

    for(var p of res.scoringPlays) {
      if(p.type.abbreviation === 'TD') {
        firstTDId = p.id
        break
      }
    }
    const [awayTeam, homeTeam] = res.boxscore.teams.map(e => e.team.abbreviation)

    const output = res.drives.previous.map(e => e.plays
      .map(play => {
        const playText = play.text.split('\n').join(' ')
        const { id, text, modified, ...rest } = play
        return {
          playId  : play.id,
          gameId  : res.header.id,
          driveId : e.id,
          qtr     : 'Q' + play.period.number,
          title   : [awayTeam, homeTeam].join(' vs. '),
          first   : {
            TD          : play.id === firstTDId ? true : false,
            scoringPlay : play.id === firstScoringPlay ? true : false,
          },
          drive: {
            team        : e.team.abbreviation,
            scoringPlay : e.isScore,
            result      : e.result
          },
          ...rest,
          homeWinPercentage : win.filter(e => e.playId === play.id).map(e => e.homeWinPercentage)[0],
          week              : res.header.week,
          text              : playText,
          players           : playText.match(/[A-Z]([a-z\s.]+)[A-Z][a-z]+/g) || []
        }
      }))

    return output
  }
}

module.exports = getPlaysByPlays
