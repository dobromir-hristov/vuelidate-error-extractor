import Vue from 'vue'
import { required } from 'vuelidate/lib/validators'
import VueI18n from 'vue-i18n'

describe('Test extractor', () => {
  let vm
  const messages = {
    en: {
      validation: {
        required: 'Field {attribute} is required'
      }
    }
  }

  beforeEach(() => {
    const i18n = new VueI18n({
      locale: 'en', // set locale
      messages // set locale messages
    })
    vm = new Vue({
      i18n,
      template: '<div><form-group :validator="$v.text" label="text"><input class="__input" v-model="text"/></form-group></div>',
      data: { text: 'stuff' },
      validations: {
        text: { required }
      }
    }).$mount()
  })

  describe('formGroup element', () => {
    it('should mount', done => {
      nextTick(() => {
        expect(vm.$el.querySelector('.form-group')).to.exist
      }).then(done)
    })

    it('should have stuff as value', () => {
      expect(vm.$el.querySelector('.__input').value).to.equal('stuff')
    })

    it('should NOT have errors', () => {
      vm.$v.$touch()
      expect(vm.$v.$error).to.be.false
    })

    it('should have errors', done => {
      vm.$v.$touch()
      vm.text = ''
      nextTick(() => {
        expect(vm.$v.text.$error).to.equal(true, 'There should be an error')
      }).then(done)
    })

    it('should have 1 error message for required', done => {
      vm.$v.$touch()
      vm.text = ''
      nextTick(() => {
        expect(vm.$el.querySelectorAll('.form-error__element').length).to.equal(1)
        expect(vm.$el.querySelector('.form-error__text').dataset.validationAttr).to.equal('required')
      }).then(done)
    })
  })
})
