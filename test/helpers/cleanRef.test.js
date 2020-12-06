const { expect } = require('chai')
const cleanRef = require('../../src/helpers/cleanRef')

const sampleResponse = {
  team: {
    $ref: 'http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2020/teams/12?lang=en&region=us'
  },
  probability: {
    $ref: 'http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/401220117/competitions/401220117/probabilities/4012201171?lang=en&region=us'
  }
}

const output = cleanRef(sampleResponse)

describe('cleanRef', () => {
  describe('Sample response with only team and probability', function () {
    it('When no price is specified, then the product status is pending approval', () => {
      expect(cleanRef(sampleResponse)).to.eql({ team: '12', probability: '4012201171' })
    })
  })
})
console.log(output)
