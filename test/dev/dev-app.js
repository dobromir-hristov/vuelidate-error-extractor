import Vue from 'vue'
import vuelidate from 'vuelidate'
import VueI18n from 'vue-i18n'
import vuelidateErrorExtractor, { templates } from '../../src/index'
import testForm from './testForm.vue'
import i18nMessages from './localesMessages'

const messages = {
  // required: 'The {attribute} field is required',
  // // min: {
  // //   string: 'The {attribute} field must be at least {min} characters.'
  // // }
  // minLength: '{attribute} field must be at least {min} chars.',
  // deeply: {
  //   nested: {
  //     email: '{ attribute } is not a valid email.'
  //   }
  // },
  // maxLength: '{attribute} field must be maximum {max} chars.'
  // deep: 'The deeply nested value {deeply.nested.value}'
}

Vue.use(vuelidate)
Vue.use(vuelidateErrorExtractor, {
  template: templates.singleErrorExtractor.foundation6,
  i18n: 'validations',
  i18nAttributes: {
    __default: 'attributes',
    first_name: 'attribute_override.first_name'
  },
  // not used in i18n mode
  messages,
  attributes: {
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    'address.street': 'Street',
    'address.city': 'City',
    'address.postal': 'Postal Code',
    'phones.model': 'Phone Model'
  }
  // validationKeys: configs.laravel
})
Vue.use(VueI18n)

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages: i18nMessages // set locale messages
})

new Vue({
  el: '#app',
  render: h => h(testForm),
  i18n
})
