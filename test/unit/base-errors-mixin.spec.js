import { shallowMount } from '@vue/test-utils'
import errorsMixin from '@/base-errors-mixin.js'
import _merge from 'lodash.merge'

const $t = jest.fn()

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

  it('determines the proper message getter', () => {
    const plainMessageSpy = jest.spyOn(wrapper.vm, 'getPlainMessage')
    expect(wrapper.vm.getErrorMessage('some_key', { attribute: 'some attribute' })).toEqual('Some message with some attribute')
    expect(plainMessageSpy).toHaveBeenCalled()
    /* i18nMessage check */
    wrapper.vm.$vuelidateErrorExtractor.i18n = 'a string'
    wrapper.vm.getErrorMessage('some_key', {})
    expect($t).toHaveBeenCalledWith('a string.some_key', {})
  })

  it('returns the first error', () => {
    expect(wrapper.vm.firstErrorMessage).toBe('Some message with someField')
  })
})
