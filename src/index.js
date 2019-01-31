import templates from './templates'
import singleErrorExtractorMixin from './single-error-extractor-mixin'
import multiErrorExtractorMixin from './multi-error-extractor-mixin'
import configs from './config/index.js'

const inDEV = process.env.NODE_ENV === 'development'

function plugin (Vue, opts = {}) {
  const options = {
    i18n: opts.i18n || false,
    i18nAttributes: opts.i18nAttributes,
    messages: opts.messages || {},
    validationKeys: opts.validationKeys || {},
    attributes: opts.attributes || {},
    name: opts.name || 'formGroup'
  }
  if (inDEV) {
    if (typeof options.i18n !== 'string' && options.i18n !== false) {
      throw Error(`[vuelidate-error-extractor] options.i18n should be false or a string, ${options.i18n} given.`)
    }
    if (typeof options.i18n === 'string' && Object.keys(options.attributes).length && options.i18nAttributes === undefined) {
      console.error('[vuelidate-error-extractor] when using "i18n" mode, prefer using "i18nAttributes" option instead of "attributes"')
    }
  }
  Vue.prototype.$vuelidateErrorExtractor = options
  if (typeof opts.template !== 'undefined') {
    Vue.component(options.name, opts.template)
  }
}

const version = '__VERSION__'

export default plugin

export { singleErrorExtractorMixin, multiErrorExtractorMixin, configs, templates, version }
