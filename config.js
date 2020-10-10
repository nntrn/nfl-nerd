const pkg = require('./package')

module.exports = {
  dirname: __dirname,
  cache: `${__dirname}/node_modules/.cache/${pkg.name}`,

  espn: {
    summary: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary'
  },

  removeBeforeSave: {
    all: ['ads', 'analytics', 'DTCpackages', 'tier2Nav', 'sport'],
    summary: ['analytics']
  }
}
