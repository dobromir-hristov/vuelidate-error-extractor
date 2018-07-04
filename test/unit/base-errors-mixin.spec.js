import { shallowMount } from '@vue/test-utils'
import errorsMixin from '@/base-errors-mixin.js'

describe('errors-mixin', () => {
  let wrapper
  const $t = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = shallowMount({ template: '<div/>' }, {
      mixins: [errorsMixin],
      propsData: {
        messages: { some_key: 'Some message with { attribute }' }
      },
      computed: {
        errors: () => ([{ validationKey: 'some_key', $dirty: true, hasError: true, params: { attribute: 'someField' } }])
      },
      mocks: {
        $vuelidateErrorExtractor: { i18n: false },
        $t
      }
    })
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
