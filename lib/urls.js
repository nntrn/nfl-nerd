const querystring = require('querystring')

const CURRENT_YEAR = (new Date()).getMonth() > 8 ?
  new Date().getFullYear() : (new Date().getFullYear() - 1)

const defaultDateProps = { year: CURRENT_YEAR, week: 1, seasontype: 2 }

const Url = {

  summary: (gameId) =>
  `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`,

  schedule: (props = defaultDateProps) =>
  `https://cdn.espn.com/core/nfl/schedule?xhr=1&${querystring.stringify(props)}`

}

module.exports = Url
