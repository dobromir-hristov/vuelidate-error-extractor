import Vue from 'vue'
import vuelidateErrorExtractor, { templates } from '../../dist/vuelidate-error-extractor.esm'
import 'babel-polyfill' // promise and etc ...
import vuelidate from 'vuelidate'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
Vue.config.productionTip = false
Vue.use(vuelidate)
Vue.use(vuelidateErrorExtractor, {
  template: templates.foundation6,
  messages: {
    required: '{attribute} is required'
  },
  genericMessages: [{
    regexp: /.+/,
    message: '{attribute} has an error'
  }]
})

window.Vue = Vue
