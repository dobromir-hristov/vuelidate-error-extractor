const replace = require('rollup-plugin-replace')
const buble = require('rollup-plugin-buble')
const banner = require('./banner')
const pack = require('../package.json')
const VuePlugin = require('rollup-plugin-vue').default
const node = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

const classifyRE = /(?:^|[-_\/])(\w)/g

function classify (str) {
  return str.replace(classifyRE, toUpper)
}

const moduleName = classify(pack.name)

const entries = {
  commonjs: {
    input: 'src/index.js',
    output: {
      file: `dist/${pack.name}.common.js`,
      name: moduleName,
      format: 'cjs'
    },
    banner
  },
  esm: {
    input: 'src/index.js',
    output: {
      file: `dist/${pack.name}.esm.js`,
      name: moduleName,
      format: 'es'
    }
  },
  production: {
    input: 'src/index.js',
    output: {
      file: `dist/${pack.name}.min.js`,
      name: moduleName,
      format: 'umd'
    },
    env: 'production'
  },
  development: {
    input: 'src/index.js',
    output: {
      file: `dist/${pack.name}.js`,
      name: moduleName,
      format: 'iife'
    },
    env: 'development'
  },
  messageExtractorMixin: {
    input: 'src/single-error-extractor-mixin.js',
    output: {
      file: 'dist/single-error-extractor.min.js',
      name: moduleName + 'ExtractorMixin',
      format: 'umd'
    },
    env: 'production'
  },
  foundationExtractor: {
    input: 'src/templates/single-error-extractor/foundation6.vue',
    output: {
      file: `dist/templates/single-error-extractor/foundation6.min.js`,
      name: moduleName + 'Foundation6Template',
      format: 'umd'
    },
    env: 'production'
  },
  bootstrapExtractor: {
    input: 'src/templates/single-error-extractor/bootstrap3.vue',
    output: {
      file: `dist/templates/single-error-extractor/bootstrap3.min.js`,
      name: moduleName + 'Bootstrap3Template',
      format: 'umd'
    },
    env: 'production'
  },
  multiErrorExtractorMixin: {
    input: 'src/multi-error-extractor-mixin.js',
    output: {
      file: 'dist/multi-error-extractor-mixin.min.js',
      name: moduleName + 'multiErrorExtractorMixin',
      format: 'umd'
    },
    env: 'production'
  },
  baseFlatExtractor: {
    input: 'src/templates/multi-error-extractor/baseMultiErrorExtractor.vue',
    output: {
      file: `dist/templates/multi-error-extractor/baseMultiErrorExtractor.min.js`,
      name: moduleName + 'baseMultiErrorExtractor',
      format: 'umd'
    },
    env: 'production'
  },
  foundationFlatExtractor: {
    input: 'src/templates/multi-error-extractor/foundation6.vue',
    output: {
      file: `dist/templates/multi-error-extractor/foundation6.min.js`,
      name: moduleName + 'Foundation6Template',
      format: 'umd'
    },
    env: 'production'
  },
  bootstrapFlatExtractorUmd: {
    input: 'src/templates/multi-error-extractor/bootstrap3.vue',
    output: {
      file: `dist/templates/multi-error-extractor/bootstrap3.min.js`,
      name: moduleName + 'Bootstrap3Template',
      format: 'umd'
    },
    env: 'production'
  }
}

function genConfig (opts) {
  const config = {
    input: opts.input,
    output: {
      ...opts.output,
      banner,
      exports: 'named'
    },
    plugins: [
      node(),
      VuePlugin(),
      buble({
        transforms: { dangerousForOf: true }
      }),
      commonjs()
    ]
  }

  const replacePluginOptions = { '__VERSION__': pack.version }
  if (opts.env) {
    replacePluginOptions['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(replace(replacePluginOptions))

  return config
}

exports.getEntry = name => genConfig(entries[name])
exports.getAllEntries = () => Object.keys(entries).map(name => genConfig(entries[name]))
