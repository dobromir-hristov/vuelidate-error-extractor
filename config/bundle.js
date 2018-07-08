const fs = require('fs-extra')
const readFile = fs.readFile
const outputFile = fs.outputFile
const relative = require('path').relative
const gzip = require('zlib').gzip
const rollup = require('rollup')
const uglify = require('uglify-js')

module.exports = build

function build (entries) {
  let built = 0
  const total = entries.length
  const next = () => {
    buildEntry(entries[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }
  next()
}

async function buildEntry (config) {
  const isProd = /min\.js$/.test(config.output.file)
  const bundle = await rollup.rollup(config)
  const { code } = await bundle.generate(config)
  if (!isProd) return write(config.output.file, code)
  var minified = (config.output.banner ? config.output.banner + '\n' : '') + uglify.minify(code, {
    fromString: true,
    output: {
      screw_ie8: true,
      ascii_only: true
    },
    compress: {
      pure_funcs: ['makeMap']
    }
  }).code
  return write(config.output.file, minified).then(zip(config.output.file))
}

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    outputFile(dest, code, function (err) {
      if (err) { return reject(err) }
      console.log(blue(relative(process.cwd(), dest)) + ' ' + getSize(code))
      resolve()
    })
  })
}

function zip (file) {
  return function () {
    return new Promise(function (resolve, reject) {
      readFile(file, function (err, buf) {
        if (err) { return reject(err) }
        gzip(buf, function (err, buf) {
          if (err) { return reject(err) }
          write(file + '.gz', buf).then(resolve)
        })
      })
    })
  }
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
