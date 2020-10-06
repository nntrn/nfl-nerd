const pkg = require('./package')

module.exports = {
  dirname: __dirname,
  cache: __dirname + `/.cache/${pkg.name}`,
  espn: {
    summary: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary'
  }
}
