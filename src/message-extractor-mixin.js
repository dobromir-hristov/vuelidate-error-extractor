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
    errorStatus: this.validator[key],
    $params: this.validator.$params[key],
    // Add the label for the :attribute parameter that is used in most Laravel validations
    params: Object.assign({}, { attribute: this.label }, params, this.validatorParams)
  }
}
export default {
  computed: {
    errors () {
      const params = {}
      // Map all the params in the validator object. They correspond to every validation rule.
      return Object.keys(this.validator.$params).map((key) => {
        // Check of we have defined our validation in the settings
        if (typeof this.validationKeys !== 'undefined' && this.validationKeys.hasOwnProperty(key)) {
          this.validationKeys[key].params.forEach(param => {
            // If we have passed a label for some of parameters, use it else use the one from Vuelidate.
            params[param.foreignKey] = this.validatorParams[param.foreignKey] || this.validator.$params[key][param.vuelidateKey]
          })
          console.log('validationKeys Exist!', this.label, key, params)
          return getValidationObject.call(this, this.validationKeys[key].validationKey, key, params)
        } else if (this.validator.$params[key] && Object.keys(this.validator.$params[key]).length) { // If the current validator key has params at all
          // We haven't defined a validation in our validationKeys setting so we try to map the params.
          Object.keys(this.validator.$params[key]).filter(k => k !== 'type').forEach(k => {
            params[k] = this.validator.$params[key][k]
          })
          console.log('No Validation Keys!', this.label, key, params)
          // We are assuming that the Vuelidate's validation keys are the same as Laravel's.
          return getValidationObject.call(this, key, key, params)
        } else {
          // There are no params, most likely its a custom validator. We just map its name and suppose Laravel has the same key.
          console.log('DEFAULT!', key)
          return getValidationObject.call(this, key)
        }
      })
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
    }
  }
}
