const { Request } = require('../../')
const { createAndWrite, jsParser } = require('../../src/utils')

const positionsApi = {
  0: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/0',
  1: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/1',
  2: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/2',
  3: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/3',
  4: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/4',
  5: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/5',
  6: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/6',
  7: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/7',
  8: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/8',
  9: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/9',
  10: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/10',
  11: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/11',
  12: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/12',
  13: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/13',
  14: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/14',
  15: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/15',
  16: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/16',
  17: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/17',
  18: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/18',
  19: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/19',
  20: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/20',
  21: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/21',
  22: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/22',
  23: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/23',
  24: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/24',
  25: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/25',
  26: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/26',
  27: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/27',
  28: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/28',
  29: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/29',
  30: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/30',
  31: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/31',
  32: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/32',
  33: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/33',
  34: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/34',
  35: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/35',
  36: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/36',
  37: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/37',
  39: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/39',
  45: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/45',
  46: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/46',
  47: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/47',
  50: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/50',
  70: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/70',
  71: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/71',
  72: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/72',
  73: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/73',
  74: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/74',
  75: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/75',
  76: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/76',
  77: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/77',
  78: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/78',
  79: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/79',
  90: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/90',
  99: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/99',
  100: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/100',
  101: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/101',
  102: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/102',
  103: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/103',
  104: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/104',
  105: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/105',
  106: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/106',
  107: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/107',
  108: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/108',
  109: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/109',
  110: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/110',
  111: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/111',
  218: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/218',
  219: 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/positions/219'
}

function cb(res) {
  return {
    id: res.id,
    name: res.name,
    abbr: res.abbreviation
  }
}

const positionsRequest = []
Object.entries(positionsApi).map(e => {
  positionsRequest.push([e[1], e[0], cb])
})

const position = new Request('nfl/position')

position
  .loadRequests(positionsRequest)
  .then(res => createAndWrite('./data/positions.js', jsParser(res)))
