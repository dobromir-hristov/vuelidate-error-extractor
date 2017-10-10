import templates from './templates'
import extractorMixin from './message-extractor-mixin'
import configs from './config/index.js'

function plugin (Vue, options = {}) {
  Vue.prototype.$vuelidateErrorExtractor = {
    i18n: options.i18n || false,
    messages: options.messages || {},
    validationKeys: options.validationKeys || {}
  }
  if (typeof options.template === 'undefined') {
    console.error('[vuelidate-message-extractor warn]: No template component provided in vuelidate-error-extractor options. Please provide a template using Vue.use(vuelidateMessageExtractor, { template: yourImportedType })')
  } else {
    options.name = options.name || 'formGroup'
    Vue.component(options.name, options.template)
  }
}

export default plugin

export { extractorMixin, configs, templates }
