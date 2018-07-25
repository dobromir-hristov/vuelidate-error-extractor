import SingleErrorExtractorMixin from '@/single-error-extractor-mixin'
import FormWrapper from '@/templates/form-wrapper'
import { required, minLength, email } from 'vuelidate/lib/validators'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuelidate from 'vuelidate'
import VueI18n from 'vue-i18n'
import _merge from 'lodash.merge'
import { i18nMessages } from './testData'

const localVue = createLocalVue()
localVue.use(VueI18n)
localVue.use(Vuelidate)

const formElement = {
  name: 'formElement',
  template: '<div class="form-element"/>',
  mixins: [SingleErrorExtractorMixin]
}

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
  const component = _merge({}, {
    template: '<div><form-element :validator="$v.text" label="Label"/></div>',
    components: { formElement, FormWrapper },
    data: () => ({ text: '' }),
    validations: {
      text: { required, minLength: minLength(10), email }
    }
  }, componentOpts)
  const mountOptions = _merge({}, {
    i18n,
    localVue,
    mocks: {
      $vuelidateErrorExtractor: {
        validationKeys: {},
        i18n: 'validation',
        attributes: {
          text: 'Text override'
        }
      }
    }
  }, mountOpts)
  return mount(component, mountOptions)
}

describe('single-error-extractor-mixin', () => {
  describe('using i18n', () => {
    let wrapper

    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('should mount', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find(formElement).exists()).toBe(true)
    })

    it('should have errors', () => {
      wrapper.vm.$v.$touch()
      const formComponent = wrapper.find(formElement).vm
      expect(wrapper.vm.$v.text.$error).toBe(true)
      expect(formComponent.hasErrors).toBe(true)
      expect(formComponent.firstErrorMessage).toBe('Field Label is required')
      expect(formComponent.activeErrors).toHaveLength(1)
    })

    it('should return array of fetched error messages', () => {
      wrapper.setData({
        text: 'invalid'
      })
      const formComponent = wrapper.find(formElement).vm
      expect(formComponent.activeErrorMessages).toEqual([])
      formComponent.validator.$touch()
      expect(formComponent.activeErrorMessages).toEqual([
        'Field Label should be at least 10 characters.',
        'Field Label is not a valid email address.'
      ])
    })

    it('should hide errors when validated', () => {
      wrapper.vm.$v.$touch()
      const formComponent = wrapper.find(formElement).vm
      expect(wrapper.vm.$v.text.$error).toBe(true)
      wrapper.setData({
        text: 'some@email.com'
      })
      expect(formComponent.hasErrors).toBe(false)
    })

    it('overrides params with validatorParams', () => {
      // Find the form element
      const formComponent = wrapper.find(formElement)
      // Set the validatorParams
      formComponent.setProps({
        validatorParams: {
          min: '99999'
        }
      })

      wrapper.setData({
        text: 'a@b.bg'
      })

      wrapper.vm.$v.$touch()
      expect(formComponent.vm.activeErrors).toContainEqual({
        validationKey: 'minLength',
        hasError: true,
        $params: expect.any(Object),
        // Add the label for the :attribute parameter that is used in most Laravel validations
        params: {
          label: 'Label',
          attribute: 'Label',
          min: '99999'
        },
        $dirty: expect.any(Boolean),
        $invalid: expect.any(Boolean),
        $error: expect.any(Boolean)
      })
      expect(formComponent.vm.activeErrorMessages).toContain('Field Label should be at least 99999 characters.')
    })
  })

  describe('using plain messages', () => {
    let wrapper

    beforeEach(() => {
      wrapper = createWrapper({
        mountOpts: {
          mocks: {
            $vuelidateErrorExtractor: {
              i18n: false,
              messages: i18nMessages.en.validation
            }
          }
        }
      })
    })

    it('shows active errors', () => {
      wrapper.setData({
        text: 'invalid'
      })
      wrapper.vm.$v.$touch()
      const component = wrapper.find(formElement).vm
      expect(component.hasErrors).toBe(true)
      expect(component.activeErrorMessages).toHaveLength(2)
      expect(component.activeErrorMessages).toEqual([
        'Field Label should be at least 10 characters.',
        'Field Label is not a valid email address.'
      ])
    })

    it('uses locally passed messages and overrides global ones', () => {
      const component = wrapper.find(formElement)
      component.setProps({
        messages: { required: 'You must fill in the {attribute} field' }
      })
      wrapper.vm.$v.$touch()
      expect(component.vm.activeErrorMessages).toContain('You must fill in the Label field')
    })

    it('uses the globally provided attributes as attribute prop', () => {
      wrapper = createWrapper({
        componentOpts: { template: '<div><form-element :validator="$v.text" label="Label" name="text"/></div>' },
        mountOpts: {
          mocks: {
            $vuelidateErrorExtractor: {
              i18n: false,
              messages: i18nMessages.en.validation
            }
          }
        }
      })
      wrapper.vm.$v.$touch()
      const component = wrapper.find(formElement)
      expect(component.vm.activeErrorMessages).toContain('Field Text override is required')
    })

    it('overrides the globally provided attributes by a local attribute', () => {
      wrapper = createWrapper({
        componentOpts: { template: '<div><form-element :validator="$v.text" attribute="Local Text" name="text"/></div>' },
        mountOpts: {
          mocks: {
            $vuelidateErrorExtractor: {
              i18n: false,
              messages: i18nMessages.en.validation
            }
          }
        }
      })
      wrapper.vm.$v.$touch()
      const component = wrapper.find(formElement)
      expect(component.vm.activeErrorMessages).toContain('Field Local Text is required')
    })
  })

  describe('using validationKeys', () => {
    let wrapper
    beforeEach(() => {
      wrapper = createWrapper({
        mountOpts: {
          mocks: {
            $vuelidateErrorExtractor: {
              validationKeys: {
                // map minLength to 'min.string' message key
                minLength: {
                  validationKey: 'min.string',
                  params: [
                    {
                      // map each param to the other
                      vue: 'min',
                      ext: 'minimum'
                    }
                  ]
                }
              },
              i18n: false,
              messages: _merge({}, i18nMessages.en.validation, {
                min: {
                  string: 'The min length of the {attribute} field should be {minimum} characters'
                }
              })
            }
          }
        }
      })
    })

    it('uses validationKeys remapped errors', () => {
      const formComponent = wrapper.find(formElement).vm
      wrapper.setData({
        text: 'asd'
      })

      // no active errors before its touched
      expect(formComponent.activeErrorMessages).toEqual([])
      // touch the validator
      formComponent.validator.$touch()
      expect(formComponent.activeErrorMessages).toEqual([
        // minLength is remapped to new message
        'The min length of the Label field should be 10 characters',
        // required uses the standard one
        'Field Label is not a valid email address.'
      ])
    })
  })

  describe('using a form wrapper', () => {
    it('uses the injected validator and global attributes', () => {
      const wrapper = createWrapper({
        componentOpts: { template: '<div><form-wrapper :validator="$v"><form-element label="Label" name="text"/></form-wrapper></div>' },
        mountOpts: {
          mocks: {
            $vuelidateErrorExtractor: {
              i18n: false,
              messages: i18nMessages.en.validation
            }
          }
        }
      })
      wrapper.vm.$v.$touch()
      const component = wrapper.find(formElement)
      expect(component.vm.activeErrorMessages).toContain('Field Text override is required')
    })
  })

  describe('using with nested $each rules', () => {
    it('finds the proper validator and assigns proper attributes', () => {
      const wrapper = createWrapper({
        componentOpts: {
          template: '<form-wrapper :validator="$v"><form-element name="phones.$each.0.batteries.$each.0.model"/></form-wrapper>',
          data: () => ({ phones: [{ batteries: [{ model: null }] }] }),
          validations: {
            phones: {
              $each: {
                batteries: {
                  $each: { model: { required } }
                }
              }
            }
          }
        },
        mountOpts: {
          mocks: {
            $vuelidateErrorExtractor: {
              i18n: false,
              messages: i18nMessages.en.validation,
              attributes: {
                'phones.batteries.model': 'Phone Battery model'
              }
            }
          }
        }
      })
      wrapper.vm.$v.$touch()
      const component = wrapper.find(formElement)
      expect(component.vm.activeErrorMessages).toContain('Field Phone Battery model is required')
    })
  })
})
