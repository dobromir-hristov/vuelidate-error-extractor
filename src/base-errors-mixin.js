import { getErrorString, get } from './utils'

export default {
  inject: {
    /**
     * Inject the validator from a parent FormWrapper component
     */
    formValidator: { default: false },
    /**
     * Injects an error messages dictionary from a parent FormWrapper
     */
    formMessages: { default: () => ({}) }
  },
  props: {
    /**
     * The Vuelidate validator object
     * Not required as a field may loose its validator under some validation rule change
     */
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
    /**
     * A dictionary of error messages that can override the globally defined ones.
     * @type {Object.<string, string>}
     */
    messages: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    /**
     * Filters out only the active errors
     * @return {array}
     */
    activeErrors () {
      return this.errors.filter(error => error.hasError && error.$dirty)
    },
    /**
     * Returns a merged messages object from the global ones, the injected ones from form-wrapper and the locally provided messages prop
     * @return {object}
     */
    mergedMessages () {
      return Object.assign({}, this.$vuelidateErrorExtractor.messages, this.formMessages, this.messages)
    },
    /**
     * Returns the first available error object
     * @return {string}
     */
    firstError () {
      return this.activeErrors.length ? this.activeErrors[0] : ''
    },
    /**
     * Returns the first available error message
     * @return {string}
     */
    firstErrorMessage () {
      return this.activeErrors.length ? this.activeErrorMessages[0] : ''
    },
    /**
     * A convenience method to check if the validator has errors
     * @return {boolean}
     */
    hasErrors () {
      return this.preferredValidator.$error
    },
    /**
     * Returns an array of all the active error messages.
     * Use this if you just need to loop over the error messages as it is cached.
     * @return {string[]}
     */
    activeErrorMessages () {
      return this.activeErrors.map(error => this.getErrorMessage(error.validationKey, error.params))
    },
    /**
     * Returns a boolean whether plugin is in i18n mode
     * @return {boolean}
     */
    $_VEE_hasI18n () {
      return !!this.$vuelidateErrorExtractor.i18n
    },
    /**
     * Returns a boolean whether i18nAttributes are available
     * @return {boolean}
     */
    $_VEE_hasI18nAttributes () {
      return !!this.$vuelidateErrorExtractor.i18nAttributes
    },
    /**
     * Returns the __default attribute from the i18nAttributes property
     * @return {string}
     */
    $_VEE_i18nDefaultAttribute () {
      return this.$_VEE_hasI18nAttributes
        ? this.$vuelidateErrorExtractor.i18nAttributes['__default']
        : ''
    }
  },
  methods: {
    /**
     * The recommended method to fetch error messages with.
     * It will choose between using i18n or the plain error method
     * @param {string} key
     * @param {object} [params]
     * @return {string}
     */
    getErrorMessage (key, params) {
      return this.$_VEE_hasI18n
        ? this.getI18nMessage(key, params)
        : this.getPlainMessage(key, params)
    },
    /**
     * Returns the translated error message
     * If a locally provided error message with the same key exists,
     * it will take weight over the default dictionary
     * @param {string} key
     * @param {object} [params]
     * @return {string}
     */
    getI18nMessage (key, params) {
      const localMessageOverride = get(this.mergedMessages, key)
      if (localMessageOverride) {
        return this.$t(localMessageOverride, params)
      }
      // fallback to the default dictionary in i18n
      return this.$t(this.$vuelidateErrorExtractor.i18n + '.' + key, params)
    },
    /**
     * Gets the error message from the provided dictionary
     * @param {string} key
     * @param {object} [params]
     * @return {string}
     */
    getPlainMessage (key, params) {
      return getErrorString(this.mergedMessages, key, params)
    }
  }
}
