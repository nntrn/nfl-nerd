/**
 * Enumaration for getting NFL team ids using team abbreviations
 * @enum {(Number|String)} teamId/teamName
 * @see https://cdn.espn.com/core/nfl/team?xhr=1&id=1
 */
const Team = {
  /** @description Buffalo Bills */
  BUF : 2,
  /** @description New England Patriots */
  NE  : 17,
  /** @description Miami Dolphins */
  MIA : 15,
  /** @description New York Jets */
  NYJ : 20,
  /** @description Pittsburgh Steelers */
  PIT : 23,
  /** @description Baltimore Ravens */
  BAL : 33,
  /** @description Cleveland Browns */
  CLE : 5,
  /** @description Cincinnati Bengals */
  CIN : 4,
  /** @description Tennessee Titans */
  TEN : 10,
  /** @description Indianapolis Colts */
  IND : 11,
  /** @description Houston Texans */
  HOU : 34,
  /** @description Jacksonville Jaguars */
  JAX : 30,
  /** @description Kansas City Chiefs */
  KC  : 12,
  /** @description Las Vegas Raiders */
  LV  : 13,
  /** @description Los Angeles Chargers */
  LAC : 24,
  /** @description Denver Broncos */
  DEN : 7,
  /** @description Dallas Cowboys */
  DAL : 6,
  /** @description Philadelphia Eagles */
  PHI : 21,
  /** @description Washington */
  WSH : 28,
  /** @description New York Giants */
  NYG : 19,
  /** @description Green Bay Packers */
  GB  : 9,
  /** @description Chicago Bears */
  CHI : 3,
  /** @description Detroit Lions */
  DET : 8,
  /** @description Minnesota Vikings */
  MIN : 16,
  /** @description Tampa Bay Buccaneers */
  TB  : 27,
  /** @description Carolina Panthers */
  CAR : 29,
  /** @description New Orleans Saints */
  NO  : 18,
  /** @description Atlanta Falcons */
  ATL : 1,
  /** @description Seattle Seahawks */
  SEA : 26,
  /** @description Los Angeles Rams */
  LAR : 14,
  /** @description Arizona Cardinals */
  ARI : 22,
  /** @description San Francisco 49ers */
  SF  : 25,
}

Object.entries(Team).forEach(e => Object.assign(Team, { [e[1]]: e[0] }))

module.exports = Object.freeze(Team)
