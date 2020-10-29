const findCacheDir = require('find-cache-dir')

const pkg = require('./package')

module.exports = {
  pkg: pkg,
  dirname: __dirname,
  cache: `${__dirname}/node_modules/.cache/${pkg.name}`,

  cacheDir: findCacheDir({ name: pkg.name, thunk: true, create: true }),

  espn: {
    summary: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary'
  },

  removeBeforeSave: {
    attr: ['links', 'logo', 'href'],
    all: ['ads', 'analytics', 'DTCpackages', 'tier2Nav', 'sport'],
    summary: ['news', 'videos', 'article']
  }
}
