function addStrings(e) {
  return `"${e}"`
}

function jsParseObject(obj) {
  const objStr = Object.entries(obj)
    .map(e => `${e[0]}: ${typeof e[1] === 'string' ? addStrings(e[1]) : e[1]}`)
    .join(', ')

  return `  { ${objStr} }`
}

function jsParser(arr) {
  return [
    '/* eslint-disable */',
    'module.exports = [',
    arr.map(e => jsParseObject(e)).join(',\n'),
    ']',
    '',
  ].join('\n')
}

module.exports = jsParser
