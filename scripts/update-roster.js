const getRoster = require('../src/getters/getRoster')
const { createAndWrite, jsParser, mapObjArrays, prettyJSON } = require('../src/utils')

const currentRoster = require('../data/roster')

function init(mapper) {
  const rosterItems = ({
    id = '',
    displayName = '',
    position = { abbreviation: '' },
    team = '' }) => ({
    id: id,
    name: displayName,
    position: position.abbreviation,
    team: team
  })

  getRoster().then(res => {
    const d = new Date()
    res.forEach(rost => {
      const newRost = rosterItems(rost)
      if(!mapper.has(rost.id)) {
        console.log(d.toLocaleString() + ', player added:', '\n', prettyJSON(newRost))
        mapper.set(rost.id, rosterItems(rost))
      }
      else if(mapper.has(rost.id)) {
        const oldRosterJSON = JSON.stringify(mapper.get(rost.id))
        const newRosterJSON = JSON.stringify(newRost)
        if(oldRosterJSON !== newRosterJSON) {
          console.log(d.toLocaleString() + ', player updated:')
          console.log('-- new: ' + newRosterJSON)
          console.log('-- old: ' + oldRosterJSON)
          mapper.set(rost.id, newRost)
        }
      }
    })
    return mapper
  }).then(res_1 => {
    createAndWrite('./data/roster.js', [
      jsParser(Object.values(Object.fromEntries(res_1)))
    ].join('\n'))
    return res_1
  })
}

init(mapObjArrays(currentRoster, 'id'))
