import Vue from 'vue'
import plugin from '../../src/index'
import 'babel-polyfill' // promise and etc ...
import vuelidate from 'vuelidate'
import VueI18n from 'vue-i18n'


Vue.use(VueI18n)
Vue.config.productionTip = false
Vue.use(vuelidate)
Vue.use(plugin, { name: 'formGroup' })

window.Vue = Vue
