import { flattenValidatorObjects, resolveAttribute } from './utils'
import baseErrorsMixin from './base-errors-mixin'

export default {
  props: {
    attributes: {
      type: Object,
      default: () => ({})
    }
  },
  extends: baseErrorsMixin,
  computed: {
    /**
     * Returns the preferred validator based on the provided validator props, the injected validator and so on.
     * @return {object}
     */
    preferredValidator () {
      // if validator prop is passed, we use it, else we use the injected one.
      if (this.$options.propsData.hasOwnProperty('validator')) return this.validator
      return this.formValidator
    },

    /**
     * Merge the global attributes and the locally provided ones
     * @return {Object.<string,string>}
     */
    mergedAttributes () {
      if (this.$_VEE_hasI18n && this.$_VEE_hasI18nAttributes) {
        return Object.assign({}, this.$vuelidateErrorExtractor.i18nAttributes, this.attributes)
      }
      return Object.assign({}, this.$vuelidateErrorExtractor.attributes, this.attributes)
    },

    /**
     * Shallow array of all the errors for the provided validator
     * @return {VeeFlatMultiErrorBag}
     */
    errors () {
      return flattenValidatorObjects(this.preferredValidator).map(error => {
        return Object.assign({}, error, {
          params: Object.assign({}, error.params, {
            attribute: this.getResolvedAttribute(error.fieldName)
          })
        })
      })
    },

    /**
     * Returns if the form has any errors
     * @return {boolean}
     */
    hasErrors () {
      return !!this.activeErrors.length
    }
  },
  methods: {
    /**
     * Returns the attribute's value, checking for i18n mode.
     * @param {string} fieldName - Validation field name.
     * @return {string}
     */
    getResolvedAttribute (fieldName) {
      return resolveAttribute.call(this, this.mergedAttributes, this.mergedAttributes, fieldName)
    }
  }
}
