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
     * @return {object  }
     */
    mergedAttributes () {
      return { ...this.$vuelidateErrorExtractor.attributes, ...this.attributes }
    },
    /**
     * Shallow array of all the errors for the provided validator
     * @return {Array}
     */
    errors () {
      return flattenValidatorObjects(this.preferredValidator).map(error => {
        return Object.assign({}, error, {
          params: Object.assign({}, error.params, {
            attribute: get(this.mergedAttributes, error.propName, error.propName)
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
  }
}
