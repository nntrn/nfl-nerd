const fetch = require('node-fetch')
const config = require('../config')
const { createAndWrite, removeObjAttr, existsSync } = require('./utils')

const BASE_URL = `https://cdn.espn.com/core/nfl/standings?xhr=1`

function getTeamData(dat) {
  return dat.content.standings.groups
    .map(group => group.groups.map(g => g.standings.entries
      .map(entry => {
        const { logos, link, uid, isActive, seed, ...rest } = entry.team
        return {
          id         : +rest.id,
          group      : g.name,
          conference : group.name,
          ...rest,
          link       : `${BASE_URL}&id=${rest.id}`,
        }
      })))
    .flat(2)
}

async function getTeams(useCache = true, cb = getTeamData) {
  const cachePath = `${config.cache}/teams.json`

  if(useCache && existsSync(cachePath)) {
    console.log('getting teams.json from', cachePath)
    return cb(require(cachePath))
  }
  console.log('fetching teams.json')
  return fetch(BASE_URL)
    .then((resp) => resp.json())
    .then(a => removeObjAttr(a, config.removeBeforeSave.all))
    .then(b => {
      createAndWrite(cachePath, JSON.stringify(b))
      return b
    })
    .then(dat => cb(dat))
    .catch(err => console.error(err))

}

module.exports.getTeams = getTeams
