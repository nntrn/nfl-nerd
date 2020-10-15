const fs = require('fs')
const path = require('path')
const findCacheDir = require('find-cache-dir')
const { createLogger, format, transports } = require('winston')
const pkg = require('./package')

const logDirectory = path.join(__dirname, 'tmp', 'logs')

fs.mkdir(logDirectory, { recursive: true }, function (err) {
  console.log(err)
})

module.exports = {
  pkg: pkg,
  dirname: __dirname,
  cache: `${__dirname}/node_modules/.cache/${pkg.name}`,

  logger: type => createLogger({
    level: 'info',
    exitOnError: false,
    format: format.combine(
      format(function (info, opts) {
        // console.log(`{ path: ${info.path}, method: ${info.method}, dataType: ${info.dataType} }`)
        return info
      })(),
      format.json(),
      format.simple(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
    ),
    transports: [
      new transports.File({ filename: path.join(logDirectory, `${type}.log`) })
    ]
  }),

  cacheDir: findCacheDir({ name: pkg.name, thunk: true, create: true }),

  espn: {
    summary: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary'
  },

  removeBeforeSave: {
    all: ['ads', 'analytics', 'DTCpackages', 'tier2Nav', 'sport'],
    summary: ['news', 'videos', 'article']
  }
}
