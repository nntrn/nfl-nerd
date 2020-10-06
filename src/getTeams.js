const fetch = require('node-fetch')
const config = require('../config')
const { createAndWrite, getIfExists } = require('./utils')

const BASE_URL = `https://cdn.espn.com/core/nfl/standings?xhr=1`

async function getTeams() {

  const cache = getIfExists(`${config.cache}/teams.json`)

  if(cache !== '') {
    return cache
  }

  const teamsData = await fetch(BASE_URL)
    .then((resp) => resp.json())
    .then(dat =>
      dat.content.standings.groups
        .map(e => e.groups.map(g => g.standings.entries
          .map(en => {
            const { logos, ...rest } = en.team
            return {
              ...rest,
              id    : +rest.id,
              group : g.name,
              link  : `${BASE_URL}&id=${rest.id}`,
            }
          }))
          .flat())
        .flat()
    )

  createAndWrite(`${config.cache}/teams.json`, JSON.stringify(teamsData))
  return teamsData
}

module.exports.getTeams = getTeams
