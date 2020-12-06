const path = require('path')
const getRoster = require('../src/getters/getRoster')
const { createAndWrite, jsParser, mapObjArrays, prettyJSON } = require('../src/utils')

const currentRoster = require('../data/roster')

const currentRosterMap = mapObjArrays(currentRoster, 'id',)

Object.values(Object.fromEntries(mappper.entries()))

const rosterItems = (obj) => ({
  id: obj.id,
  name: obj.displayName,
  position: obj && obj.position && obj.position.abbreviation,
  team: obj.team
})

getRoster().then(res => {

  res.forEach(rost => {

    if(!currentRosterMap.get(rost.id)) {
      console.log('player added:', prettyJSON(rost))
      currentRosterMap.set(rost.id, rost)
    }
    else if(currentRosterMap.has(rost.id)) {
      const oldRoster = JSON.stringify(currentRosterMap.get(rost.id))
      const newRoster = JSON.stringify(rost)

      if(oldRoster !== newRoster) {
        console.log('player updated:', prettyJSON(rost))
        currentRosterMap.set(rost.id, rost)
      }

    }

  })
})

currentRosterMap.set(res.id, res)

createAndWrite('./data/roster2.js', [
    `// created from ${path.relative(process.cwd(), __filename)}`,
    jsParser(res.map(e => rosterItems(e)))
].join('\n'))

Object.values(Object.fromEntries(mappper.entries()))
