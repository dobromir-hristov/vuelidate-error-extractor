import templates from './templates'
import singleErrorExtractorMixin from './single-error-extractor-mixin'
import multiErrorExtractorMixin from './multi-error-extractor-mixin'
import configs from './config/index.js'

function plugin (Vue, opts = {}) {
  const options = {
    i18n: opts.i18n || false,
    messages: opts.messages || {},
    validationKeys: opts.validationKeys || {},
    attributes: opts.attributes || {},
    name: opts.name || 'formGroup'
  }
  if (typeof options.i18n !== 'string' && options.i18n !== false) {
    throw Error(`[vuelidate-error-extractor] options.i18n should be false or a string, ${options.i18n} given.`)
  }
  Vue.prototype.$vuelidateErrorExtractor = options
  if (typeof opts.template !== 'undefined') {
    Vue.component(options.name, opts.template)
  }
}

const version = '__VERSION__'

export default plugin

export { singleErrorExtractorMixin, multiErrorExtractorMixin, configs, templates, version }
