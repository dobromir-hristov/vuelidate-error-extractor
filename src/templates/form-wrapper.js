export default {
  name: 'FormWrapper',
  props: {
    validator: {
      type: Object,
      required: true
    },
    messages: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    return h('div', this.$slots.default)
  },
  provide () {
    return {
      formValidator: this.validator,
      formMessages: this.messages
    }
  }
}
