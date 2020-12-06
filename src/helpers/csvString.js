const papaparse = require('papaparse')
const { flattenObject } = require('../utils')

const papaparseOptions = {
  quotes         : false,
  quoteChar      : '"',
  escapeChar     : '"',
  delimiter      : ',',
  header         : true,
  newline        : '\n',
  skipEmptyLines : false,
  columns        : null
}

module.exports = function csvString(data) {
  // traverse array and flatten each object
  if(Array.isArray(data)) {
    const data2 = data.map(e => flattenObject(e))
    return papaparse.unparse(data2, papaparseOptions)
  }

  return papaparse.unparse(flattenObject(data), papaparseOptions)
}
