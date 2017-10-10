import { template, get, getValidationObject } from './utils'

export default {
  computed: {
    errors () {
      const params = {}
      const _$vParams = this.validator.$params
      const _$vKeys = this.$vuelidateErrorExtractor.validationKeys
      // Map all the params in the validator object. They correspond to every validation rule.
      return Object.keys(_$vParams).map((key) => {
        // Check of we have defined our validation in the settings
        if (typeof _$vKeys !== 'undefined' && _$vKeys.hasOwnProperty(key)) {
          _$vKeys[key].params.forEach(param => {
            // Use the extra supplied data via validator-params prop or use the one from vuelidate
            params[param.ext] = this.validatorParams[param.other] || _$vParams[key][param.vue]
          })
          return getValidationObject.call(this, _$vKeys[key].validationKey, key, params)
        } else if (_$vParams[key] && Object.keys(_$vParams[key]).length) { // If the current validator key has params at all
          // We haven't defined a validation in our validationKeys setting so we try to map the Vuelidate params.
          Object.keys(_$vParams[key]).filter(k => k !== 'type').forEach(k => {
            params[k] = _$vParams[key][k]
          })
          // We are assuming that the Vuelidate's validation keys are the same as Laravel's.
          return getValidationObject.call(this, key, key, params)
        } else {
          // There are no params, most likely its a custom validator. We just map its name and suppose Laravel has the same key.
          return getValidationObject.call(this, key)
        }
      })
    },
    activeErrors () {
      return this.errors.filter(error => !error.hasError)
    },
    mergedMessages () {
      return Object.assign({}, this.$vuelidateErrorExtractor.messages, this.messages)
    },
    firstError () {
      return this.activeErrors.length ? this.activeErrors[0] : ''
    },
    firstErrorMessage () {
      return this.getErrorMessage(this.firstError.validationKey, this.firstError.params)
    },
    hasErrors () {
      return this.validator.$error
    }
  },
  methods: {
    getErrorMessage (key, properties) {
      return this.$vuelidateErrorExtractor.i18n ? this.getI18nMessage(key, properties) : this.getPlainMessage(key, properties)
    },
    getI18nMessage (key, properties) {
      return this.$t(this.$vuelidateErrorExtractor.i18n + '.' + key, properties)
    },
    getPlainMessage (key, properties) {
      const msg = get(key, this.mergedMessages)
      if (msg === '') {
        process.env.NODE_ENV === 'development' && console.warn(`[vuelidate-error-extractor]: Key ${key} is not present in error messages`)
        return key
      }
      return template(msg, properties)
    }
  },
  props: {
    label: String,
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
     * Params that are passed for the validation.
     * Example: {other: $t('auth.password')} when using a sameAs validation and we need a translated "other" field.
     */
    validatorParams: {
      type: Object,
      default: () => ({})
    },
    messages: {
      type: Object,
      default: () => ({})
    },
    showSingleError: {
      type: Boolean,
      default: false
    }
  }
}
