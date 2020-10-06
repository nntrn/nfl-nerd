const { getSchedule } = require('../src/getSchedule')
const { createAndWrite } = require('../src/utils')

const years = [
  // 2017, 2016,
  2018, 2019, 2020
]

years.forEach(e => {
  getSchedule(e).then(data => {
    createAndWrite(`./tmp/schedule/${e}.json`, JSON.stringify(data, null, 2))
  })
})
