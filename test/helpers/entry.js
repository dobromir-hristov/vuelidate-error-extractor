import Vue from 'vue'
import vuelidateErrorExtractor, { elements } from '../../dist/vuelidate-error-extractor.esm'
import 'babel-polyfill' // promise and etc ...
import vuelidate from 'vuelidate'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
Vue.config.productionTip = false
Vue.use(vuelidate)
Vue.use(vuelidateErrorExtractor, { type: elements.foundation })

window.Vue = Vue
