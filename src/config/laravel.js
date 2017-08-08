export default {
  data () {
    return {
      validationKeys: {
        minLength: {
          validationKey: 'min.string',
          params: [
            {
              vuelidateKey: 'min',
              foreignKey: 'min'
            }
          ]
        },
        sameAs: {
          validationKey: 'same',
          params: [
            {
              vuelidateKey: 'eq',
              foreignKey: 'other'
            }
          ]
        }
      }
    }
  }
}
