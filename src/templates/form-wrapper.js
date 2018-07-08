export default {
  name: 'FormWrapper',
  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  render (h) {
    return h('div', this.$slots.default)
  },
  provide () {
    return {
      formValidator: this.validator
    }
  }
}
