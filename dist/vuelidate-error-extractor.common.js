/*!
 * vuelidate-error-extractor v0.0.0 
 * (c) 2017 Dobromir Hristov
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Return the proper validation object
 * @param {String} validationKey - Key by which we will get the translation
 * @param {String} key - Key to get the error status from
 * @param {Object} params - All the extra params that will be merged with the Given validatorParams prop.
 * @return {Object}
 */
function getValidationObject (validationKey, key, params) {
  if ( key === void 0 ) key = validationKey;
  if ( params === void 0 ) params = {};

  return {
    validationKey: validationKey,
    errorStatus: this.validator[key],
    $params: this.validator.$params[key],
    // Add the label for the :attribute parameter that is used in most Laravel validations
    params: Object.assign({}, { attribute: this.label }, params, this.validatorParams)
  }
}
var messageExtractorMixin = {
  computed: {
    errors: function errors () {
      var this$1 = this;

      var params = {};
      // Map all the params in the validator object. They correspond to every validation rule.
      return Object.keys(this.validator.$params).map(function (key) {
        // Check of we have defined our validation in the settings
        if (typeof this$1.validationKeys !== 'undefined' && this$1.validationKeys.hasOwnProperty(key)) {
          this$1.validationKeys[key].params.forEach(function (param) {
            // If we have passed a label for some of parameters, use it else use the one from Vuelidate.
            params[param.foreignKey] = this$1.validatorParams[param.foreignKey] || this$1.validator.$params[key][param.vuelidateKey];
          });
          console.log('validationKeys Exist!', this$1.label, key, params);
          return getValidationObject.call(this$1, this$1.validationKeys[key].validationKey, key, params)
        } else if (this$1.validator.$params[key] && Object.keys(this$1.validator.$params[key]).length) { // If the current validator key has params at all
          // We haven't defined a validation in our validationKeys setting so we try to map the params.
          Object.keys(this$1.validator.$params[key]).filter(function (k) { return k !== 'type'; }).forEach(function (k) {
            params[k] = this$1.validator.$params[key][k];
          });
          console.log('No Validation Keys!', this$1.label, key, params);
          // We are assuming that the Vuelidate's validation keys are the same as Laravel's.
          return getValidationObject.call(this$1, key, key, params)
        } else {
          // There are no params, most likely its a custom validator. We just map its name and suppose Laravel has the same key.
          console.log('DEFAULT!', key);
          return getValidationObject.call(this$1, key)
        }
      })
    }
  },
  props: {
    label: String,
    validator: {
      type: Object,
      default: function () { return ({
        $dirty: false,
        $error: false,
        $invalid: true,
        $pending: false,
        $params: []
      }); }
    },
    /**
     * Params that are passed for the validation.
     * Example: {other: $t('auth.password')} when using a sameAs validation and we need a translated "other" field.
     */
    validatorParams: {
      type: Object,
      default: function () { return ({}); }
    }
  }
};

var FoundationElement = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"form-group",class:{error: _vm.validator.$error}},[_vm._t("label",[(_vm.label)?_c('label',{class:{'is-invalid-label': _vm.validator.$error}},[_vm._v(_vm._s(_vm.label)+" "+_vm._s(_vm.errors ? '*' : ''))]):_vm._e()]),_vm._t("default"),_vm._t("errors",[(_vm.validator.$error)?_c('div',{staticClass:"form-error is-visible"},_vm._l((_vm.errors),function(error){return _c('div',[(!error.errorStatus)?_c('span',[_vm._v(_vm._s(_vm.$t('validation.' + error.validationKey, error.params)))]):_vm._e()])})):_vm._e()])],2)},staticRenderFns: [],
  mixins: [messageExtractorMixin]
};

var BooststrapElement = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"form-group",class:{'has-error': _vm.validator.$error, 'has-success':(!_vm.validator.$error && !_vm.validator.$dirty)}},[_vm._t("label",[(_vm.label)?_c('label',[_vm._v(_vm._s(_vm.label)+" "+_vm._s(_vm.errors ? '*' : ''))]):_vm._e()]),_vm._t("default"),_vm._t("errors",[(_vm.validator.$error)?_c('div',{staticClass:"help-block"},_vm._l((_vm.errors),function(error){return _c('div',[(!error.errorStatus)?_c('span',[_vm._v(_vm._s(_vm.$t('validation.' + error.validationKey, error.params)))]):_vm._e()])})):_vm._e()])],2)},staticRenderFns: [],
  mixins: [messageExtractorMixin]
};

var laravel = {
  data: function data () {
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
};

var index = {
  laravel: laravel
};

function plugin (Vue, options) {
  Vue.component(options.name || 'formGroup', options.element || FoundationElement);
}

var elements = {
  foundation: FoundationElement,
  bootstrap: BooststrapElement
};

exports['default'] = plugin;
exports.elements = elements;
exports.extractorMixin = messageExtractorMixin;
exports.configs = index;
