const Base = require('./Api')
const config = require('../config')

const { createAndWritePromise, getMe } = require('../src/utils')

function getCalendarCb(data) {
  return {
    year : getMe('content.parameters.year', data),
    data : getMe('content.calendar.entries', data)
      .map((e, i) => e.map((aa, ai) => ({ seasontype: i + 1, week: ai + 1, ...aa })))
      .flat()
  }
}

function getYearScheduleCb(data) {
  return Object.values(data.content.schedule)
    .map(e => Object.values(e.games)
      .map(g => {
        let [awayTeam, homeTeam] = g.shortName.split(' @ ')
        return {
          gameId     : g.id,
          date       : new Date(g.date).toLocaleDateString(),
          time       : new Date(g.date).toLocaleTimeString(),
          name       : g.shortName,
          title      : g.name,
          awayGame   : awayTeam,
          homeGame   : homeTeam,
          status     : g.status.type.name,
          ...data.content.parameters,
          summaryApi : `${config.espn.summary}?event=${g.id}`
        }
      }))
    .flat()

}

// https://www.espn.com/allsports/scorecenter/v3/events?sport=nfl
module.exports = {

  createNew: Base.addChild,

  getPlayByPlay: new Base({
    name     : 'playbyplay',
    url      : 'https://cdn.espn.com/core/nfl/playbyplay',
    query    : { xhr: 1 },
    required : ['gameId'],
    exclude  : ['sport', 'nowFeedSupported']
  }),

  getSummary: new Base({
    name     : 'summary',
    url      : 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary',
    query    : { },
    required : ['event'],
    exclude  : ['news', 'videos', 'article']
  }),

  getCalendar: new Base({
    name     : 'schedule',
    url      : 'https://cdn.espn.com/core/nfl/schedule',
    query    : { xhr: 1 },
    required : [],
    optional : ['year', 'week', 'seasontype'],
    exclude  : ['sport', 'nowFeedSupported'],
    callback : getCalendarCb,

  }),

  getSchedule: new Base({
    name     : 'schedule',
    url      : 'https://cdn.espn.com/core/nfl/schedule',
    query    : { xhr: 1 },
    required : [],
    optional : ['year', 'week', 'seasontype'],
    exclude  : ['sport', 'nowFeedSupported'],
    callback : getYearScheduleCb,

  }),

  getStanding: new Base({
    name     : 'standing',
    url      : 'https://cdn.espn.com/core/nfl/standing',
    query    : { xhr: 1 },
    required : [],
    optional : ['season', 'view', 'group', 'sort', 'seasontype']
  })
}
