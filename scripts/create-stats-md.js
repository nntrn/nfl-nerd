const path = require('path')
const Connect = require('../src/connection')
const { createAndWrite, getCSVString, prettyJSON, parseArgs, groupBy } = require('../src/utils')
var AsciiTable = require('ascii-table')
const dl = require('@nntrn/datalib-extras')
const Pivot = require('quick-pivot')

function makeAsciiTable(obj, config = {}) {
  var table = new AsciiTable()
  const { title = '' } = config

  table.setTitle(title).setHeading(...obj[0])

  obj.slice(1,)
    .filter(e => e[0] !== 'null')
    .forEach(o => table.addRow(...o))
  return [
    obj.length > 25 && '<details>\n',
    '```',
    table.toString(),
    '```',
    obj.length > 25 && '\n</details>'
  ].filter(Boolean).join('\n')
}

function makeAsciiTable2(obj, config = {}) {
  var table = new AsciiTable()
  const { title = '' } = config

  table.setTitle(title).setHeading(Object.keys(obj[0]))

  obj
    .forEach(o => table.addRow(Object.values(o)))
  return ['```', table.toString(), '```'].join('\n')
}

function highlightFirstTd(team, opp, scoreValue) {
  const score = [team, opp].join('-')
  if(((team - scoreValue) + opp) < 6) {
    return `<mark>${score}</mark>`
  }
  return score
}

function bold(str) {
  return `**${str}**`
}

function getPivot(dataArray, config) {
  const { row, cols = 'qtr', type = 'count', dimension = 'timeElapsed' } = config
  const rowsToPivot = [row].flat(2)
  const colsToPivot = [cols].flat(2)
  const aggregationDimension = dimension
  const aggregator = type

  const pivot = new Pivot(dataArray, rowsToPivot, colsToPivot, aggregationDimension, aggregator)
  return pivot.data.table.map(e => e.value)
}

function run() {
  const todaysDate = (new Date()).toDateString()
  const teams = [...arguments]

  var markdownText = []

  if(teams.length > 0) {
    const db = new Connect(path.resolve('tmp/nfldb.db'))

    const playsDb = db
      .getTable('plays')
      .filter(Boolean)
      .map(row => {
        const { alternativeText, shortAlternativeText, shortText, ...rest } = row
        return {
          ...rest,
          text: shortText
            .replace(/\s?\d/g, '')
            .replace(/\s\s+/g, ' ')
            .split(',')
            .slice(0, 2)
            .map(e => e.trim()).join(', ')
            .split(' (')
            .slice(0, 1)
        }
      })

    const dat = playsDb
      .filter(e => teams.includes(e.team))
      .map(e => ({
        ...e,
        qtr: 'Q' + e.periodNumber,
      }))

    const last2Min = dat
      .filter(e => e.periodNumber === 2)
      .filter(e => e.timeElapsed >= 1680)
      .filter(e => e.scoringPlay === 'true')
      .map(e => ({ team: e.team, date: e.date, type: e.typeAbbreviation, timeElapsed: e.timeElapsed, clock: e.clockDisplayValue }))

    markdownText.push(`## score in last 2 min of 1H?`)
    Object.entries(groupBy(last2Min, 'team')).forEach(g => markdownText.push(makeAsciiTable2(g[1])))

    const first6min = dat
      .filter(e => e.periodNumber === 1)
      .filter(e => e.timeElapsed <= 60 * 6)
      .filter(e => e.scoringPlay === 'true')
      .map(e => ({ team: e.team, date: e.date, type: e.typeAbbreviation, timeElapsed: e.timeElapsed, clock: e.clockDisplayValue }))

    markdownText.push(`\n\n## score in first 6 min of 1H?`)
    Object.entries(groupBy(first6min, 'team')).forEach(g => markdownText.push(makeAsciiTable2(g[1])))

    markdownText.push('\n\n')
    markdownText.push(`# ${teams.join(' & ')}`)
    markdownText.push(teams.map(t => `* [${t}](#${t.toLowerCase()})`).join('\n'))
    markdownText.push('\n---\n')

    // createAndWrite(`public/allplays.csv`, getCSVString(playsDb))
    createAndWrite(`public/getData.js`, [
      '/* eslint-disable */',
      'function getData(){',
      `  return ${prettyJSON(playsDb, null, 2)}`,
      '}'
    ].join('\n'))

    teams.forEach(team => {
      const teamDat = dat
        .filter(e => e.team === team)
        .filter(Boolean)

      const excludeDl = [
        'shortAlternativeText',
        'shortText',
        'wallclock',
        'alternativeText',
        'clockDisplayValue'
      ]

      const dlDat = dl.extras.summary(teamDat)
        .filter(e => e.summaryType === 'categorical')
        .filter(e => e.distinct > 1)
        .filter(e => !excludeDl.includes(e.name))

      const grouped = dl.groupby('participantsScorer')
        .execute(teamDat.filter(e => e.participantsScorer))
        .map(e => ({ ...e, count: e.values.length,
          values: e.values.map(v => [
            v.date,
            v.typeText,
            v.qtr,
            v.clockDisplayValue,
            v.timeElapsed,
            highlightFirstTd(v.teamScore, v.oppScore, v.scoreValue),
          ].join(', '))
        }))

      markdownText.push('## ' + team)
      markdownText.push(
        grouped.map(e => [
          '',
          bold(e.participantsScorer),
          e.values.map(ee => ' * ' + ee).join('\n'),
        ].join('\n')).join('\n')
      )

      const teamDatStats = playsDb
        .filter(e => (e.team === team) || (e.opp === team))
        .filter(e => e.periodNumber === 0)
        .filter(Boolean)

      markdownText.push('\n---\n')
      markdownText.push(teamDatStats.map(e => e.date + ' ' + e.text).join('\n'))
      markdownText.push('\n---\n')

      Object.values(dlDat).forEach(each => {
        markdownText.push('\n')
        markdownText.push('### ' + each.name)
        markdownText.push(
          makeAsciiTable(
            getPivot(
              teamDat.filter(e2 => e2.periodNumber > 0),
              { row: each.name, cols: 'qtr', dimension: 'playId' }
            ),
            { title: team + ': ' + each.name })
        )

        if(each.name === 'date' || each.name === 'qtr') {
          markdownText.push(
            makeAsciiTable(
              getPivot(
                teamDat.filter(e2 => e2.periodNumber > 0),
                { row: each.name, cols: 'qtr', type: 'sum', dimension: 'scoreValue' }
              ),
              { title: `${team}: ${each.name}` })
          )
        }

        if(each.name === 'participantsScorer') {
          markdownText.push(
            makeAsciiTable(
              getPivot(
                teamDat.filter(e2 => e2.periodNumber > 0),
                { row: each.name, cols: 'qtr', type: 'min' }
              ),
              { title: `${team}: ${each.name} - MIN` })
          )
        }
      })
      markdownText.push('\n')
    })
    createAndWrite(`tmp/${todaysDate}/${teams.join('-')}.md`, markdownText.join('\n'))
  } else {
    throw Error('no teams specified')
  }
}

const argv = parseArgs(process.argv.slice(2))

if(argv.teams) {
  run(...argv.teams)
}
