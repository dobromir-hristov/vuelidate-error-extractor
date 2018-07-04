import { flattenValidatorObjects } from './utils'
import errorsMixin from './base-errors-mixin'

export default {
  props: {
    attributes: {
      type: Object,
      default: () => ({})
    }
  },
  extends: errorsMixin,
  computed: {
    mergedAttributes () {
      return Object.assign({}, this.$vuelidateErrorExtractor.attributes, this.attributes)
    },
    errors () {
      return flattenValidatorObjects(this.validator).map(error => {
        const params = Object.assign({}, error.params, {
          attribute: this.mergedAttributes[error.propName]
        })
        return Object.assign({}, error, { params })
      })
    }
  }
}
