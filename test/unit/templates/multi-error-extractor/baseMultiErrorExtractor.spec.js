import baseMultiErrorExtractor from '@/templates/multi-error-extractor/baseMultiErrorExtractor'
import { required, minLength, email, maxLength } from 'vuelidate/lib/validators'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuelidate from 'vuelidate'
import VueI18n from 'vue-i18n'
import _merge from 'lodash.merge'
import { i18nMessages } from '../../testData'

const localVue = createLocalVue()
localVue.use(VueI18n)
localVue.use(Vuelidate)

/**
 * Creates the testable component wrapper
 * @param opts
 * @param {ComponentOptions} [opts.componentOpts] - Override component options
 * @param {ThisTypedMountOptions} [opts.mountOpts] - Override mount options
 * @return {Wrapper<Vue>}
 */
function createWrapper (opts = {}) {
  const { componentOpts = {}, mountOpts = {} } = opts
  const i18n = new VueI18n({
    locale: 'en', // set locale
    messages: i18nMessages // set locale messages
  })
  const component = _merge({
    template: '<div><multi-errors :validator="$v.form" :attributes="localAttributes"/></div>',
    components: { multiErrors: baseMultiErrorExtractor },
    data: () => ({
      form: {
        first_name: '',
        last_name: '',
        email: '',
        address: {
          street: '',
          city: '',
          postal: ''
        }
      },
      localAttributes: {}
    }),
    validations: {
      form: {
        first_name: { required, minLength: minLength(3), maxLength: maxLength(20) },
        last_name: { required, minLength: minLength(3), maxLength: maxLength(20) },
        email: { required, email },
        address: {
          street: { required, minLength: minLength(5) },
          city: { required, minLength: minLength(5) },
          postal: { required }
        }
      }
    }
  }, componentOpts)
  return mount(
    component, _merge({}, {
      i18n,
      localVue,
      mocks: {
        $vuelidateErrorExtractor: {
          validationKeys: {},
          i18n: 'validation',
          attributes: {
            first_name: 'First Name',
            last_name: 'Last Name',
            email: 'Email',
            'address.street': 'Street',
            'address.city': 'City'
          }
        }
      }
    }, mountOpts)
  )
}

describe('baseMultiErrorExtractor', () => {
  let wrapper
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Displays a list of errors in the dom', () => {
    wrapper = createWrapper()
    wrapper.vm.$v.form.$touch()
    // expect(wrapper.find(baseMultiErrorExtractor).vm.validator).toEqual({})
    expect(wrapper.find(baseMultiErrorExtractor).vm.activeErrors).toEqual({})
    expect(wrapper.element).toMatchSnapshot()
  })
})
