/*!
 * vuelidate-error-extractor v1.1.0 
 * (c) 2017 Dobromir Hristov
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.VuelidateErrorExtractorMixin = global.VuelidateErrorExtractorMixin || {})));
}(this, (function (exports) { 'use strict';

/**
 * Deeply fetch dot notated strings from object.
 * Has fallback if value does not exist
 * @param {String} string - Dot notated string
 * @param {Object} object - Object to traverse
 * @param {*} fallback - Fallback value
 * @return {*}
 */
function get (string, object, fallback) {
  if ( fallback === void 0 ) fallback = '';

  var result = string.split('.').reduce(function (obj, current) { return obj[current]; }, object);
  return typeof result === 'undefined' ? fallback : result
}

/**
 * Replace dot notated strings in curly braces for values
 * @param {String} template - Template to search
 * @param {Object} object - Object with data to traverse
 * @return {string}
 */
function template (template, object) {
  if (typeof template !== 'string') {
    throw new TypeError(("Expected a string in the first argument, got " + (typeof template)))
  }

  if (typeof object !== 'object') {
    throw new TypeError(("Expected an Object/Array in the second argument, got " + (typeof object)))
  }
  var regx = /{(.*?)}/g;

  return template.replace(regx, function (_, key) { return (get(key, object) || ''); })
}

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
    hasError: this.validator[key],
    $params: this.validator.$params[key],
    // Add the label for the :attribute parameter that is used in most Laravel validations
    params: Object.assign({}, { attribute: this.label, label: this.label }, params, this.validatorParams)
  }
}

var messageExtractorMixin = {
  computed: {
    errors: function errors () {
      var this$1 = this;

      var params = {};
      var _$vParams = this.validator.$params;
      var _$vKeys = this.$vuelidateErrorExtractor.validationKeys;
      // Map all the params in the validator object. They correspond to every validation rule.
      return Object.keys(_$vParams).map(function (key) {
        // Check of we have defined our validation in the settings
        if (typeof _$vKeys !== 'undefined' && _$vKeys.hasOwnProperty(key)) {
          _$vKeys[key].params.forEach(function (param) {
            // Use the extra supplied data via validator-params prop or use the one from vuelidate
            params[param.ext] = this$1.validatorParams[param.other] || _$vParams[key][param.vue];
          });
          return getValidationObject.call(this$1, _$vKeys[key].validationKey, key, params)
        } else if (_$vParams[key] && Object.keys(_$vParams[key]).length) { // If the current validator key has params at all
          // We haven't defined a validation in our validationKeys setting so we try to map the Vuelidate params.
          Object.keys(_$vParams[key]).filter(function (k) { return k !== 'type'; }).forEach(function (k) {
            params[k] = _$vParams[key][k];
          });
          // We are assuming that the Vuelidate's validation keys are the same as Laravel's.
          return getValidationObject.call(this$1, key, key, params)
        } else {
          // There are no params, most likely its a custom validator. We just map its name and suppose Laravel has the same key.
          return getValidationObject.call(this$1, key)
        }
      })
    },
    activeErrors: function activeErrors () {
      return this.errors.filter(function (error) { return !error.hasError; })
    },
    mergedMessages: function mergedMessages () {
      return Object.assign({}, this.$vuelidateErrorExtractor.messages, this.messages)
    },
    firstError: function firstError () {
      return this.activeErrors.length ? this.activeErrors[0] : ''
    },
    firstErrorMessage: function firstErrorMessage () {
      return this.getErrorMessage(this.firstError.validationKey, this.firstError.params)
    },
    hasErrors: function hasErrors () {
      return this.validator.$error
    }
  },
  methods: {
    getErrorMessage: function getErrorMessage (key, properties) {
      return this.$vuelidateErrorExtractor.i18n ? this.getI18nMessage(key, properties) : this.getPlainMessage(key, properties)
    },
    getI18nMessage: function getI18nMessage (key, properties) {
      return this.$t(this.$vuelidateErrorExtractor.i18n + '.' + key, properties)
    },
    getPlainMessage: function getPlainMessage (key, properties) {
      var msg = get(key, this.mergedMessages);
      if (msg === '') {
        "development" === 'development' && console.warn(("[vuelidate-error-extractor]: Key " + key + " is not present in error messages"));
        return key
      }
      return template(msg, properties)
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
    },
    messages: {
      type: Object,
      default: function () { return ({}); }
    },
    showSingleError: {
      type: Boolean,
      default: false
    }
  }
};

exports['default'] = messageExtractorMixin;

Object.defineProperty(exports, '__esModule', { value: true });

})));
