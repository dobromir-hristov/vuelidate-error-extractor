import template from 'string-template'

/**
 * Return the proper validation object
 * @param {String} validationKey - Key by which we will get the translation
 * @param {String} key - Key to get the error status from
 * @param {Object} params - All the extra params that will be merged with the Given validatorParams prop.
 * @return {Object}
 */
function getValidationObject (validationKey, key = validationKey, params = {}) {
  return {
    validationKey,
    hasError: this.validator[key],
    $params: this.validator.$params[key],
    // Add the label for the :attribute parameter that is used in most Laravel validations
    params: Object.assign({}, { attribute: this.label }, params, this.validatorParams)
  }
}

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
            // If we have passed a value for some of parameters use it, else use the one from Vuelidate.
            params[param.ext] = this.validatorParams[param.other] || _$vParams[key][param.vue]
          })
          return getValidationObject.call(this, _$vKeys[key].validationKey, key, params)
        } else if (_$vParams[key] && Object.keys(_$vParams[key]).length) { // If the current validator key has params at all
          // We haven't defined a validation in our validationKeys setting so we try to map the params.
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
    }
  },
  methods: {
    getErrorMessage (key, properties) {
      return this.$vuelidateErrorExtractor.i18n ? this.$t(this.$vuelidateErrorExtractor.i18n + '.' + key, properties) : template(this.mergedMessages[key], properties)
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
    }
  }
}
