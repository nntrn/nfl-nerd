const declarations = ['const', 'let', 'var', 'import']

module.exports = {
  env: {
    browser : true,
    commonjs: true,
    es6     : true,
    node    : true
  },
  parserOptions: {
    ecmaVersion : 2019,
    sourceType  : 'module',
    ecmaFeatures: {
      jsx                         : true,
      classes                     : true,
      defaultParams               : true,
      experimentalObjectRestSpread: true,
    }
  },
  root   : true,
  globals: {
    Atomics          : 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'array-bracket-spacing'    : ['error', 'never'],
    'arrow-spacing'            : ['error', { before: true, after: true }],
    'block-spacing'            : ['error', 'always'],
    'brace-style'              : 0,
    'comma-spacing'            : ['error', { before: false, after: true }],
    'computed-property-spacing': ['error', 'never'],
    'eol-last'                 : ['error', 'always'],
    'indent'                   : [2, 2, { ignoredNodes: ['TemplateLiteral *']}],
    'key-spacing'              : [2, {
      singleLine: {
        beforeColon: false,
        afterColon : true
      },
      multiLine: {
        beforeColon: false,
        afterColon : true,
        align      : 'colon'
      }
    }],
    // 'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'keyword-spacing': ['error', { overrides: {
      if   : { after: false },
      for  : { after: false },
      while: { after: false }
    }}],
    'lines-between-class-members'    : ['error', 'always', { exceptAfterSingleLine: false }],
    'no-irregular-whitespace'        : ['error', { skipRegExps: true }],
    'no-multiple-empty-lines'        : ['error', { max: 1, maxEOF: 1 }],
    'no-multi-spaces'                : ['error', { ignoreEOLComments: true }],
    'no-return-await'                : ['error'],
    'no-trailing-spaces'             : ['error'],
    'object-curly-spacing'           : ['error', 'always', { arraysInObjects: false, objectsInObjects: false }],
    'padding-line-between-statements': ['error',
      { blankLine: 'never', prev: '*', next: '*' },
      { blankLine: 'any', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: 'multiline-expression', next: '*' },
      { blankLine: 'any', prev: '*', next: ['multiline-expression', 'expression']},
      { blankLine: 'never', prev: [...declarations], next: [...declarations]},
      { blankLine: 'any', prev: [...declarations], next: '*' },
      { blankLine: 'always', prev: [...declarations], next: ['function', 'class']},
      { blankLine: 'any', prev: '*', next: [...declarations]},
      { blankLine: 'any', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'multiline-const' },
      { blankLine: 'always', prev: 'multiline-const', next: '*' },
      { blankLine: 'any', prev: '*', next: ['cjs-export', 'export']},
      { blankLine: 'any', prev: ['cjs-export', 'export'], next: '*' },
      { blankLine: 'always', prev: '*', next: ['class', 'function']},
      { blankLine: 'any', prev: '*', next: 'if' }
    ],
    'quotes'                     : ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'quote-props'                : ['error', 'consistent-as-needed'],
    'semi-spacing'               : ['error', { before: false, after: true }],
    'semi-style'                 : ['error', 'first'],
    'semi'                       : ['error', 'never'],
    'space-before-blocks'        : 'error',
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
    'space-in-parens'            : ['error', 'never'],
    'space-infix-ops'            : ['error'],
    'space-unary-ops'            : ['error'],
    'spaced-comment'             : ['error', 'always'],
    'switch-colon-spacing'       : ['error', { after: true, before: false }],
    'template-curly-spacing'     : ['error', 'never'],
    'template-tag-spacing'       : ['error', 'always'],
  },
}
