import { getErrorString } from './utils'

export default {
  inject: {
    formValidator: { default: false },
    formMessages: { default: () => ({}) }
  },
  props: {
    validator: {
      type: Object,
      default: () => ({
        $dirty: false,
        $error: false,
        $invalid: true,
        $pending: false,
        $params: []
      })
    },
    messages: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    /**
     * Filters out only the active errors
     * @return {Array}
     */
    activeErrors () {
      return this.errors.filter(error => error.hasError && error.$dirty)
    },
    mergedMessages () {
      return Object.assign({}, this.$vuelidateErrorExtractor.messages, this.formMessages, this.messages)
    },
    firstError () {
      return this.activeErrors.length ? this.activeErrors[0] : ''
    },
    firstErrorMessage () {
      return this.activeErrors.length ? this.activeErrorMessages[0] : ''
    },
    hasErrors () {
      return this.preferredValidator.$error
    },
    activeErrorMessages () {
      return this.activeErrors.map(error => this.getErrorMessage(error.validationKey, error.params))
    }
  },
  methods: {
    getErrorMessage (key, params) {
      return this.$vuelidateErrorExtractor.i18n ? this.getI18nMessage(key, params) : this.getPlainMessage(key, params)
    },
    getI18nMessage (key, params) {
      return this.$t(this.$vuelidateErrorExtractor.i18n + '.' + key, params)
    },
    getPlainMessage (key, params) {
      return getErrorString(this.mergedMessages, key, params)
    }
  }
}
