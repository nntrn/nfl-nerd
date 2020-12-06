// Deep replace $ref urls with relative id

// before:
// ```
// {
//   "team": {
//     "$ref": "/nfl/seasons/2020/teams/12?lang=en"
//   },
//   "probability": {
//     "$ref": "/nfl/events/401220117/competitions/401220117/probabilities/4012201171"
//   }
// }
// ```

// after:
// ```
// { team: '12', probability: '4012201171' }
// ```

function createSingularRefObj(e) {
  let keys = e.split(/[^\w\d]/g).filter(Boolean)
  let key = keys[0].replace(/ies$/, 'y').replace(/(?<!ie)s$/, '')
  return { [key]: keys[1] }
}

function refClean(ref, key) {
  if(ref.indexOf('/') < 0) {
    return ref
  }

  const newRef = ref.match(/(\w+)\/(\d+)[/?]?/g)
    .map(e => createSingularRefObj(e))
    .reduce((a, b) => Object.assign(a, b), {})

  return newRef[key] ? newRef[key] : newRef
}

function deepReplaceRef(data) {
  if(Array.isArray(data)) {
    return data.map(e => deepReplaceRef(e))
  }
  return Object.keys(data).reduce((object, key) => {
    object[key] = typeof data[key] === 'object' ?
      deepReplaceRef(data[key]) : data[key]
    if(data[key] && Object.keys(data[key]).includes('$ref')) {
      if(data[key].$ref.indexOf('/') > -1) {
        object[key] = refClean(data[key].$ref, key)
      }
    }
    return object
  }, Array.isArray(data) ? [] : {})
}

module.exports = deepReplaceRef
