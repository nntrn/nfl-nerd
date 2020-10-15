const Api = require('../lib/Api')

const { cwd } = require('process')

console.log(cwd())

const summary = new Api({
  name: 'summary',
  url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary',
  query: { },
  required: ['event'],
  exclude: ['news', 'videos', 'article']
})

summary
  .setQuery({ event: 401220313 })
  .fetchJsonAsync()
  .writeTo(`./out2/401220313.json`)
