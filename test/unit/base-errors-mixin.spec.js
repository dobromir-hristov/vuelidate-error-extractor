import { shallowMount } from '@vue/test-utils'
import errorsMixin from '@/base-errors-mixin.js'
import _merge from 'lodash.merge'

const $t = jest.fn(t => t)

function createWrapper (override) {
  return shallowMount({ template: '<div/>' }, _merge({}, {
    mixins: [errorsMixin],
    propsData: {
      messages: { some_key: 'Some message with {attribute}' }
    },
    computed: {
      errors: () => ([{ validationKey: 'some_key', $dirty: true, hasError: true, params: { attribute: 'someField' } }])
    },
    mocks: {
      $vuelidateErrorExtractor: { i18n: false, attributes: {}, messages: {} },
      $t
    }
  }, override))
}

describe('base-errors-mixin', () => {
  let wrapper
  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = createWrapper()
  })

  it('uses the plain Error message getter by default', () => {
    const plainMessageSpy = jest.spyOn(wrapper.vm, 'getPlainMessage')
    expect(wrapper.vm.getErrorMessage('some_key', { attribute: 'some attribute' }))
      .toEqual('Some message with some attribute')
    expect(plainMessageSpy).toHaveBeenCalled()
  })

  it('uses i18n to fetch the error message and allows overriding with a local messages prop', () => {
    wrapper.vm.$vuelidateErrorExtractor.i18n = 'validations'
    // it will use the provided local messages prop if possible
    expect(wrapper.vm.getErrorMessage('some_key', {}))
      .toEqual('Some message with {attribute}')
    expect($t).toHaveBeenCalledTimes(1)
  })

  it('uses i18n dictionary if no local override possible', () => {
    wrapper.vm.$vuelidateErrorExtractor.i18n = 'validations'
    // remove the local messages to see if it uses the default i18n message
    wrapper.setProps({
      messages: {}
    })
    expect(wrapper.vm.getErrorMessage('some_key', {}))
      .toEqual('validations.some_key')
    expect($t).toHaveBeenCalledTimes(1)
  })

  it('returns the first error', () => {
    expect(wrapper.vm.firstErrorMessage).toBe('Some message with someField')
  })
})
