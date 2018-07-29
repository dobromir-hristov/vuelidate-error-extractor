import { flattenValidatorObjects, get } from './utils'
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
    preferredValidator () {
      // if validator is passed is present on propsData, user has explicitly provided it.
      if (this.$options.propsData.hasOwnProperty('validator')) return this.validator
      return this.formValidator
    },
    mergedAttributes () {
      return Object.assign({}, this.$vuelidateErrorExtractor.attributes, this.attributes)
    },
    errors () {
      return flattenValidatorObjects(this.preferredValidator).map(error => {
        const params = Object.assign({}, error.params, {
          attribute: get(this.mergedAttributes, error.propName, error.propName)
        })
        return Object.assign({}, error, { params })
      })
    },
    /**
     * Returns if the form has any errors
     * @return {boolean}
     */
    hasErrors () {
      return !!this.activeErrors.length
    }
  }
}
