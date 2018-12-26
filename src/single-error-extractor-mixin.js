import { get, getValidationObject, getAttribute } from './utils'
import baseErrorsMixin from './base-errors-mixin'

export default {
  props: {
    /**
     * A generic label that is shown as a Label above the input and replaces the attribute placeholder if not provided.
     * @type {string}
     */
    label: { type: String, default: '' },
    /**
     * Replaces the {attribute} placeholder in the error message fields.
     * @type {string}
     */
    attribute: { type: String, default: '' },
    /**
     * Used to find the attribute and validator of the field when used with a FormWrapper component.
     * @type {string}
     */
    name: { type: String, default: '' },
    /**
     * Params that are passed for the validation.
     * @type { Object.<string, (string|number)> }
     * Example: {other: $t('auth.password')} when using a sameAs validation and we need a translated "other" field.
     */
    validatorParams: {
      type: Object,
      default: () => ({})
    },
    /**
     * Whether to show only one error at a time
     * @type {boolean}
     */
    showSingleError: {
      type: Boolean,
      default: false
    }
  },
  extends: baseErrorsMixin,
  computed: {
    /**
     * Returns the appropriate validator based on provided validator props, injected validator and so on.
     * @return {object}
     */
    preferredValidator () {
      // if validator is passed is present on propsData, user has explicitly provided it.
      if (this.$options.propsData.hasOwnProperty('validator')) return this.validator
      return this.name ? get(this.formValidator, this.name, this.validator) : this.validator
    },
    /**
     * Returns an array of possible error objects
     * @return {any[]}
     */
    errors () {
      const vualidateParams = this.preferredValidator.$params
      /** @type {Object.<string, { validationKey: string, params: { ext: string, vue: string }[]}>} */
      const remappedValidation = this.$vuelidateErrorExtractor.validationKeys || {}
      // Map all the params in the validator object. They correspond to every validation rule.
      return Object.keys(vualidateParams).map((validationRuleKey) => {
        const vuelidateValidatorObject = vualidateParams[validationRuleKey]
        // Check of we have defined our validation remap in the settings
        if (remappedValidation.hasOwnProperty(validationRuleKey)) {
          const params = remappedValidation[validationRuleKey].params.reduce((all, paramKey) => {
            // Use the extra supplied data via validator-params prop or use the one from vuelidate
            all[paramKey.ext] = this.validatorParams[paramKey.vue] || vuelidateValidatorObject[paramKey.vue]
            return all
          }, {})
          return getValidationObject.call(this, remappedValidation[validationRuleKey].validationKey, validationRuleKey, params)
        }
        const params = Object.assign({}, vuelidateValidatorObject, this.validatorParams)
        delete params.type
        // We are using the Vuelidate keys
        return getValidationObject.call(this, validationRuleKey, validationRuleKey, params)
      })
    },
    /**
     * Generic helper object to assign events easier.
     * @return {{ input: function }}
     */
    events () {
      return { input: () => this.preferredValidator.$touch() }
    },
    /**
     * Returns true if field is dirty and has no errors, else null
     * @return {?Boolean}
     */
    isValid () {
      return this.preferredValidator.$dirty ? !this.hasErrors : null
    },
    /**
     * Returns the attribute property depending on provided props - label, attribute, name etc.
     * @return {string}
     */
    resolvedAttribute () {
      return getAttribute(this.$vuelidateErrorExtractor.attributes, this.attribute, this.label, this.name)
    }
  }
}
