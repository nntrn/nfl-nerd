const API = require('../urls')
const Request = require('../request')

const seasonWeeksEnum = { OFF: 1, POST: 5, PRE: 5, REG: 17 }
const seasonValueEnum = { 1: 'PRE', 2: 'REG', 3: 'POST', 4: 'OFF' }

class Schedule {

  constructor() {
    this.urls = []
  }

  /**
   * @return {number} year of current nfl season
   */
  getCurrentSeason() {
    return (new Date()).getMonth() >= 8 ?
      new Date().getFullYear() :
      (new Date().getFullYear() - 1)
  }

  /**
   * @param {object}[props={}] seasontype and year
   * @return {array} list of urls
   */
  getUrls(props = {}) {
    const ops = { year: this.getCurrentSeason(), seasontype: 2, ...props }
    var weeks = seasonWeeksEnum.REG

    if(Number(ops.seasontype) > 0 && Number(ops.seasontype) < 5) {
      weeks = seasonWeeksEnum[seasonValueEnum[ops.seasontype]]
    }
    const urls = []
    for(var wk = 1; wk < weeks + 1; wk++) {
      urls.push(
        API.schedule({ year: ops.year, seasontype: ops.seasontype, week: wk })
      )
    }
    this.urls = urls
    return urls
  }

  getGameIds(json) {
    return Object.values(json.content.schedule)
      .map(e => e.games)
      .flat()
      .map(e => ({
        gameId : e.id,
        name   : e.shortName,
        date   : (new Date(e.date)).toLocaleDateString('en-us'),
      }))
  }

  async getGames(cb = this.getGameIds) {
    if(this.urls.length < 1) {
      this.getUrls()
    }
    return Request.getRequest(this.urls, cb)
  }

}

module.exports = new Schedule()
