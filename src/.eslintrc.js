
module.exports = {
  env: {
    node: true,
  },
  globals: {
    Atomics           : 'readonly',
    SharedArrayBuffer : 'readonly',
  },
  parserOptions: {
    ecmaVersion : 2018,
    sourceType  : 'module',
  },
  rules: {
    'key-spacing': ['error', {
      multiLine: {
        beforeColon : false,
        afterColon  : true
      },
      align: {
        beforeColon : true,
        afterColon  : true,
        on          : 'colon'
      }
    }],
  },
}
