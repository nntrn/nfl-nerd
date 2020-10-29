const fetch = require('node-fetch')
const RequestService = require('./request')
const { deepExclude } = require('../src/utils')

const API = require('./urls')
const getPlaysByPlays = require('./helpers/getPbp')

/** A class for making API calls */
class NflNerd {

  constructor() {
  /** @type {Array} list of Object keys to exclude from data output */
    this.KEYS_TO_EXCLUDE = [
      'ads', 'analytics', 'links', 'link', 'logo', 'images', 'href', '$ref',
      'uid', 'guid', 'geobroadcast', 'defaults', 'headshot', 'DTCpackages'
    ]
    this._excludeKeys = false
  }

  static getURL(key) {
    if(key.includes(Object.keys(API))) {
      return API[key]
    }
    return API
  }

  /**
   * Assign new array to this.KEYS_TO_EXCLUDE
   * @param {array} keys
   */
  setExcludeKeys(keys) {
    if(Array.isArray(keys)) {
      this.KEYS_TO_EXCLUDE = keys
    } else {
      throw new Error('Input needs to be an array')
    }
  }

  lookInThisDirectory(dirPath) {
    this.dataDirectory = dirPath
  }

  /**
   * Get the API response for gameId
   * @param {(number|string)} gameId
   * @return {!Promise<object>}
   */
  getSummary(gameId) {
    return RequestService.getRequest(API.summary(gameId))
      .then(resp => deepExclude(resp, this.KEYS_TO_EXCLUDE))
      .catch(err => console.error(err))
  }

  /**
   * Get playbyplays w/ win probability, first TD, and first scoring play
   * @param {(number|string)} gameId
   * @return {!Promise<array>} Returns
   */
  getPlayByPlays(gameId = '') {
    return RequestService.getRequest(API.summary(gameId))
      .then(resp => deepExclude(resp, this.KEYS_TO_EXCLUDE))
      .then(res => getPlaysByPlays(res))
      .catch(err => console.error(err))
  }

  /**
   * Get playbyplays for multiple games
   * @param {array} arrGameIds list of gameIds
   * @return {!Promise<array>} Returns
   */
  async getAllPlaysByPlays(arrGameIds = []) {
    let promises = []

    for(var i = 0; i < arrGameIds.length; i++) {
      promises.push(
        fetch(API.summary(arrGameIds[i]))
          .then((resp) => resp.json())
          .then(res => deepExclude(res, this.KEYS_TO_EXCLUDE))
          .then(cleanedDat => getPlaysByPlays(cleanedDat))
          .catch(err => console.error(err))
      )
    }
    const returnArr = await Promise.all(promises)
    return returnArr.flat(2)
  }

}

module.exports = NflNerd
