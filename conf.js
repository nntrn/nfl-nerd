const config = require('./config')

module.exports = {
  plugins: [
    'plugins/markdown',
    // 'plugins/summarize'
  ],

  sourceType: 'module',
  source: {
    includePattern: '.+\\.js(doc|x)?$',
    include: ['.'],
    exclude: ['node_modules', 'docs']
  },
  recurseDepth: 10,
  opts: {
    destination: './docs/',
    recurse: true,
    private: true,

    template: './node_modules/toast-jsdoc',
    readme: './readme.md'

  },
  templates: {
    monospaceLinks: false,
    cleverLinks: true,
    search: true,

    default: {
      nav: {
        subsection: {
          typedef: false,
          class: false
        }
      }
    }
  }
}
