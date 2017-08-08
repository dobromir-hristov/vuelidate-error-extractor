import FoundationElement from './messageExtractorFoundation6.vue'
import BooststrapElement from './messageExtractorBootstrap.vue'
import extractorMixin from './message-extractor-mixin'
import configs from './config/index.js'

function plugin (Vue, options = {}) {
  if (!options.type) {
    FoundationElement.mixins.push(configs.laravel)
    options.type = FoundationElement
  }
  options.name = options.name || 'formGroup'
  Vue.component(options.name, options.type)
}

export default plugin

export const elements = {
  foundation: FoundationElement,
  bootstrap: BooststrapElement
}

export { extractorMixin, configs }
