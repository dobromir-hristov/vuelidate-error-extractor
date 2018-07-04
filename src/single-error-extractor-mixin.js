import { getValidationObject } from './utils'
import errorsMixin from './base-errors-mixin'

export default {
  props: {
    label: { type: String, default: '' },
    attribute: { type: String, default: '' },
    /**
     * Params that are passed for the validation.
     * Example: {other: $t('auth.password')} when using a sameAs validation and we need a translated "other" field.
     */
    validatorParams: {
      type: Object,
      default: () => ({})
    },
    showSingleError: {
      type: Boolean,
      default: false
    }
  },
  extends: errorsMixin,
  computed: {
    errors () {
      const vualidateParams = this.validator.$params
      const remappedValidation = this.$vuelidateErrorExtractor.validationKeys
      // Map all the params in the validator object. They correspond to every validation rule.
      return Object.keys(vualidateParams).map((key) => {
        const vuelidateValidatorObject = vualidateParams[key]
        // Check of we have defined our validation remap in the settings
        if (typeof remappedValidation !== 'undefined' && remappedValidation.hasOwnProperty(key)) {
          const params = remappedValidation[key].params.reduce((all, paramKey) => {
            // Use the extra supplied data via validator-params prop or use the one from vuelidate
            all[paramKey.ext] = this.validatorParams[paramKey.other] || vuelidateValidatorObject[paramKey.vue]
            return all
          }, {})
          return getValidationObject.call(this, remappedValidation[key].validationKey, key, params)
        }
        const params = Object.assign({}, vuelidateValidatorObject, this.validatorParams)
        delete params.type
        // We are using the Vuelidate keys
        return getValidationObject.call(this, key, key, params)
      })
    }
  }
}
