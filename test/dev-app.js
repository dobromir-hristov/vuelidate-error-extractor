import Vue from 'vue'
import vuelidate from 'vuelidate'
import VueI18n from 'vue-i18n'
import vuelidateErrorExtractor, { templates, configs } from '../dist/vuelidate-error-extractor.esm'
import testElement from './dev/testElement.vue'

Vue.use(vuelidate)
Vue.use(vuelidateErrorExtractor, {
  template: templates.foundation,
  i18n: 'validations',
  messages: { required: 'The {attribute} field is required' },
  validationKeys: configs.laravel
})
Vue.use(VueI18n)

const messages = {
  en: {
    validations: {
      required: 'The {attribute} field is required!',
      min: {
        string: 'The {attribute} field must be at least {min} characters.'
      }
    }
  },
  bg: {
    validations: {
      required: 'Полето {attribute} е задължително!'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages // set locale messages
})

new Vue({
  el: '#app',
  components: {
    testElement
  },
  i18n
})
