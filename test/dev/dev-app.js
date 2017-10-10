import Vue from 'vue'
import vuelidate from 'vuelidate'
import VueI18n from 'vue-i18n'
import vuelidateErrorExtractor, { templates, configs } from '../../src/index'
import testElement from './testElement.vue'

const messages = {
  required: 'The field is required'
  // min: {
  //   string: 'The {attribute} field must be at least {min} characters.'
  // }
  // deep: 'The deeply nested value {deeply.nested.value}'
}

Vue.use(vuelidate)
Vue.use(vuelidateErrorExtractor, {
  template: templates.foundation6,
  // i18n: 'validations',
  messages
  // validationKeys: configs.laravel
})
Vue.use(VueI18n)
//
// const i18nMessages = {
//   en: {
//     validations: {
//       required: 'The {attribute} field is required!',
//       min: {
//         string: 'The {attribute} field must be at least {min} characters.'
//       }
//     }
//   },
//   bg: {
//     validations: {
//       required: 'Полето {attribute} е задължително!'
//     }
//   }
// }

// Create VueI18n instance with options
// const i18n = new VueI18n({
//   locale: 'en', // set locale
//   messages: i18nMessages // set locale messages
// })

new Vue({
  el: '#app',
  components: {
    testElement
  }
  // i18n
})
