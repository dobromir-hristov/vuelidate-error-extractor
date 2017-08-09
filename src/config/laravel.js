export default {
  minLength: {
    validationKey: 'min.string',
    params: [
      {
        vue: 'min',
        ext: 'min'
      }
    ]
  },
  sameAs: {
    validationKey: 'same',
    params: [
      {
        vue: 'eq',
        ext: 'other'
      }
    ]
  }
}
