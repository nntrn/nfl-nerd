const nerd = require('../lib/nflnerd')
const { createAndWritePromise, getMe } = require('../src/utils')

const outputPath = `${__dirname}/out`

nerd.getSummary
  .setQuery({ event: 401220313 })
  .fetchJsonAsync()
  .writeTo('./out/401220313.json')

// nerd.getSummary.writeTo('./out2/test.json')
// .then(dat => createAndWritePromise(
//   `${outputPath}/summary/${nerd.getSummary.get('query.event')}.json`,
//   JSON.stringify(dat, null, 2)
// ))

// const summary2 = nerd.createNew('summary', nerd.getSummary)

nerd.getCalendar
  .fetchJsonAsync()
  .writeTo('./out/calendar.json')
  // .then(dat => createAndWritePromise(
  //   `${outputPath}/schedule/calendar.json`,
  //   JSON.stringify(nerd.getCalendar.callback(dat), null, 2)
  // ))

nerd.getSchedule
  .fetchJsonAsync()
  .writeTo('./out/this-week.json')
  // .then(dat => createAndWritePromise(
  // `${outputPath}/schedule/this-week.json`,
  // JSON.stringify(nerd.getSchedule.callback(dat), null, 2)
  // ))
