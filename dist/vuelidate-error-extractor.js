/*!
 * vuelidate-error-extractor v2.4.0 
 * (c) 2019 Dobromir Hristov
 * Released under the MIT License.
 */
var VuelidateErrorExtractor = (function (exports) {
  'use strict';

  /*!
   * isobject <https://github.com/jonschlinkert/isobject>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  var isobject = function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
  };

  /*!
   * get-value <https://github.com/jonschlinkert/get-value>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   */


  var getValue = function (target, path, options) {
    if (!isobject(options)) {
      options = {
        default: options
      };
    }

    if (!isValidObject(target)) {
      return typeof options.default !== 'undefined' ? options.default : target;
    }

    if (typeof path === 'number') {
      path = String(path);
    }

    var isArray = Array.isArray(path);
    var isString = typeof path === 'string';
    var splitChar = options.separator || '.';
    var joinChar = options.joinChar || (typeof splitChar === 'string' ? splitChar : '.');

    if (!isString && !isArray) {
      return target;
    }

    if (isString && path in target) {
      return isValid(path, target, options) ? target[path] : options.default;
    }

    var segs = isArray ? path : split(path, splitChar, options);
    var len = segs.length;
    var idx = 0;

    do {
      var prop = segs[idx];

      if (typeof prop === 'number') {
        prop = String(prop);
      }

      while (prop && prop.slice(-1) === '\\') {
        prop = join([prop.slice(0, -1), segs[++idx] || ''], joinChar, options);
      }

      if (prop in target) {
        if (!isValid(prop, target, options)) {
          return options.default;
        }

        target = target[prop];
      } else {
        var hasProp = false;
        var n = idx + 1;

        while (n < len) {
          prop = join([prop, segs[n++]], joinChar, options);

          if (hasProp = prop in target) {
            if (!isValid(prop, target, options)) {
              return options.default;
            }

            target = target[prop];
            idx = n - 1;
            break;
          }
        }

        if (!hasProp) {
          return options.default;
        }
      }
    } while (++idx < len && isValidObject(target));

    if (idx === len) {
      return target;
    }

    return options.default;
  };

  function join(segs, joinChar, options) {
    if (typeof options.join === 'function') {
      return options.join(segs);
    }

    return segs[0] + joinChar + segs[1];
  }

  function split(path, splitChar, options) {
    if (typeof options.split === 'function') {
      return options.split(path);
    }

    return path.split(splitChar);
  }

  function isValid(key, target, options) {
    if (typeof options.isValid === 'function') {
      return options.isValid(key, target);
    }

    return true;
  }

  function isValidObject(val) {
    return isobject(val) || Array.isArray(val) || typeof val === 'function';
  }

  /**
   * Gets object values deeply by using a dot notation path
   * @param {object} obj
   * @param {string} path
   * @param {*} [def]
   * @return {*}
   */
  function get (obj, path, def) {
    return getValue(obj, path, { default: def })
  }

  function formatErrorMessage (message) {
    return ("[vuelidate-error-extractor]: " + message)
  }

  /**
   * Replace dot notated strings in curly braces for values
   * @param {String} template - Template to search
   * @param {Object} object - Object with data to traverse
   * @return {string}
   */
  function template (template, object) {
    if (typeof template !== 'string') {
      throw new TypeError(formatErrorMessage(("Expected a string in the first argument, got " + (typeof template))))
    }

    if (typeof object !== 'object') {
      throw new TypeError(formatErrorMessage(("Expected an Object/Array in the second argument, got " + (typeof object))))
    }
    var regx = /{(.*?)}/g;

    return template.replace(regx, function (_, key) { return get(object, key, ''); })
  }

  /**
   * Return the proper validation object
   * @param {String} validationKey - Key by which we will get the translation
   * @param {String} key - Key to get the error status from
   * @param {Object} params - All the extra params that will be merged with the Given validatorParams prop.
   * @return {Object}
   */
  function getValidationObject (validationKey, key, params) {
    if ( params === void 0 ) params = {};

    return {
      validationKey: validationKey,
      hasError: !this.preferredValidator[key],
      $params: this.preferredValidator.$params[key],
      $dirty: this.preferredValidator.$dirty,
      $error: this.preferredValidator.$error,
      $invalid: this.preferredValidator.$invalid,
      // Add the label for the :attribute parameter that is used in most Laravel validations
      params: Object.assign({}, {
        attribute: this.resolvedAttribute,
        label: this.label
      }, params, this.validatorParams)
    }
  }

  /**
   * The flat
   * @typedef VeeFlatMultiError
   * @property {string} fieldName - The name of the field validated. Can be dot.path based.
   * @property {string} validationKey - Name of the validation rule
   * @property {boolean} hasError - Whether it has an error or not
   * @property {object} params - The object holding merged params from Vuelidate + custom provided ones
   * @property {boolean} $dirty - Whether its dirty. Vuelidate.$dirty
   * @property {boolean} $error - Whether there is an error or not. Vuelidate.$error
   * @property {boolean} $invalid - Whether the field is invalid. Vuelidate.$invalid
   */

  /**
   * A collection of VeeFlatMultiError objects
   * @typedef {VeeFlatMultiError[]} VeeFlatMultiErrorBag
   */

  /**
   * Flattens a deep Vuelidate Validator object to a normalized flat structure
   * @param {object} validator - Vuelidate Validator object
   * @param {string} [fieldName] - Name of validated field. Builds a dot.path when used on deep objects. Passed by recursive call to same function.
   * @return {VeeFlatMultiErrorBag}
   */
  function flattenValidatorObjects (validator, fieldName) {
    // loop the validator objects
    return Object.entries(validator)
    // leave those that dont have $ in their name with exception of $each
      .filter(function (ref) {
        var key = ref[0];
        var value = ref[1];

        return !key.startsWith('$') || key === '$each';
    })
      .reduce(function (errors, ref) {
        var key = ref[0];
        var value = ref[1];

        // if its an object, its probably a deeply nested object
        if (typeof value === 'object') {
          var nestedValidatorName =
            // Key can be "$each", a "string" or a "number" from inside "$each".
            // If "key" is "$each" or a string (from a nested object like "address.postal_code"), use the passed fieldName as its a recursive call from previous call.
            (key === '$each' || !isNaN(parseInt(key))) ? fieldName
              // if fieldName is available, build it like `model.brand` from `model.$each.0.brand`.
              : fieldName ? (fieldName + "." + key)
              // fallback to the "key" if "fieldName" is not available
              : key;
          // recursively call the flatten again on the same error object, looking deep into it.
          return errors.concat(flattenValidatorObjects(value, nestedValidatorName))
        } // else its the validated prop
        var params = Object.assign({}, validator.$params[key]);
        // delete type as it is coming for Vuelidate and may interfere with user custom attributes
        delete params.type;
        errors.push({
          fieldName: fieldName,
          validationKey: key,
          hasError: !value,
          params: params,
          $dirty: validator.$dirty,
          $error: validator.$error,
          $invalid: validator.$invalid
        });
        return errors
      }, [])
  }

  /**
   * Fetches error message by its key from the provided messages object
   * Key can be a deep dot notation path 'path.to.object' in "{ path:{ to: { object: {} } } }"
   * @param {object} messages
   * @param {string} key
   * @param {object} [params]
   * @return {string}
   */
  function getErrorString (messages, key, params) {
    var msg = get(messages, key, false);
    if (!msg) {
      return key
    }
    return template(msg, params)
  }

  /**
   * Strip the "$each.0" from field names
   * @type {RegExp}
   */
  var NORMALIZE_ATTR_REGEX = /\$each\.\d\./g;

  /**
   * Retrieves a validations attribute from the provided attributes object
   * @param {object} attributes - Map of attribute name as key to attribute value
   * @param {string} fieldName - The attribute key. Can be dot.notation.
   * @return {string}
   */
  function getAttribute (attributes, fieldName) {
    // strip out the $each and fetch the attribute from the attributes object. Return the name if it does exist on the object
    var normalizedName = fieldName.replace(NORMALIZE_ATTR_REGEX, '');
    return get(attributes, normalizedName, normalizedName)
  }

  /**
   * Retrieves the translated attribute value by its key.
   * If key is not present in the provided attributes parameter,
   * we build it using the $_VEE_i18nDefaultAttribute key.
   * @param {object} attributes - Map of attribute name as keys and paths to translations as values
   * @param {string} fieldName - Attribute name, can be name or dot notation path to key
   * @return {string}
   */
  function getI18nAttribute (attributes, fieldName) {
    // strip out the $each from the name
    var normalizedName = fieldName.replace(NORMALIZE_ATTR_REGEX, '');
    // fetches the attribute key from the i18nAttributes property. Can be dot.notation based.
    var attributeKey = get(attributes, normalizedName);
    // if there is such a key in the passed attributes param, we translate with it directly
    if (attributeKey) {
      return this.$t(attributeKey)
    } else {
      // We dont have the key defined and no __default attribute, so we just return the key so its not empty
      if (!this.$_VEE_i18nDefaultAttribute) {
        return normalizedName
      }
      // use the defaultAttribute to build the path to the attribute translation
      return this.$t(((this.$_VEE_i18nDefaultAttribute) + "." + normalizedName))
    }
  }

  /**
   * Resolves the attribute depending if in i18n mode or not
   * @param {Object.<string, string>} i18nAttributes
   * @param {Object.<string, string>} attributes
   * @param {string} name - Validated field name. Dot.path based
   * @return {string}
   */
  function resolveAttribute (i18nAttributes, attributes, name) {
    // if its in 18n mode and has i18n attributes defined, extract them
    if (this.$_VEE_hasI18n && this.$_VEE_hasI18nAttributes) {
      return getI18nAttribute.call(this, i18nAttributes, name)
    } else {
      return getAttribute(attributes, name)
    }
  }

  var baseErrorsMixin = {
    inject: {
      /**
       * Inject the validator from a parent FormWrapper component
       */
      formValidator: { default: false },
      /**
       * Injects an error messages dictionary from a parent FormWrapper
       */
      formMessages: { default: function () { return ({}); } }
    },
    props: {
      /**
       * The Vuelidate validator object
       * Not required as a field may loose its validator under some validation rule change
       */
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
       * A dictionary of error messages that can override the globally defined ones.
       * @type {Object.<string, string>}
       */
      messages: {
        type: Object,
        default: function () { return ({}); }
      }
    },
    computed: {
      /**
       * Filters out only the active errors
       * @return {array}
       */
      activeErrors: function activeErrors () {
        return this.errors.filter(function (error) { return error.hasError && error.$dirty; })
      },
      /**
       * Returns a merged messages object from the global ones, the injected ones from form-wrapper and the locally provided messages prop
       * @return {object}
       */
      mergedMessages: function mergedMessages () {
        return Object.assign({}, this.$vuelidateErrorExtractor.messages, this.formMessages, this.messages)
      },
      /**
       * Returns the first available error object
       * @return {string}
       */
      firstError: function firstError () {
        return this.activeErrors.length ? this.activeErrors[0] : ''
      },
      /**
       * Returns the first available error message
       * @return {string}
       */
      firstErrorMessage: function firstErrorMessage () {
        return this.activeErrors.length ? this.activeErrorMessages[0] : ''
      },
      /**
       * A convenience method to check if the validator has errors
       * @return {boolean}
       */
      hasErrors: function hasErrors () {
        return this.preferredValidator.$error
      },
      /**
       * Returns an array of all the active error messages.
       * Use this if you just need to loop over the error messages as it is cached.
       * @return {string[]}
       */
      activeErrorMessages: function activeErrorMessages () {
        var this$1 = this;

        return this.activeErrors.map(function (error) { return this$1.getErrorMessage(error.validationKey, error.params); })
      },
      /**
       * Returns a boolean whether plugin is in i18n mode
       * @return {boolean}
       */
      $_VEE_hasI18n: function $_VEE_hasI18n () {
        return !!this.$vuelidateErrorExtractor.i18n
      },
      /**
       * Returns a boolean whether i18nAttributes are available
       * @return {boolean}
       */
      $_VEE_hasI18nAttributes: function $_VEE_hasI18nAttributes () {
        return !!this.$vuelidateErrorExtractor.i18nAttributes
      },
      /**
       * Returns the __default attribute from the i18nAttributes property
       * @return {string}
       */
      $_VEE_i18nDefaultAttribute: function $_VEE_i18nDefaultAttribute () {
        return this.$_VEE_hasI18nAttributes
          ? this.$vuelidateErrorExtractor.i18nAttributes['__default']
          : ''
      }
    },
    methods: {
      /**
       * The recommended method to fetch error messages with.
       * It will choose between using i18n or the plain error method
       * @param {string} key
       * @param {object} [params]
       * @return {string}
       */
      getErrorMessage: function getErrorMessage (key, params) {
        return this.$_VEE_hasI18n
          ? this.getI18nMessage(key, params)
          : this.getPlainMessage(key, params)
      },
      /**
       * Returns the translated error message
       * If a locally provided error message with the same key exists,
       * it will take weight over the default dictionary
       * @param {string} key
       * @param {object} [params]
       * @return {string}
       */
      getI18nMessage: function getI18nMessage (key, params) {
        var localMessageOverride = get(this.mergedMessages, key);
        if (localMessageOverride) {
          return this.$t(localMessageOverride, params)
        }
        // fallback to the default dictionary in i18n
        return this.$t(this.$vuelidateErrorExtractor.i18n + '.' + key, params)
      },
      /**
       * Gets the error message from the provided dictionary
       * @param {string} key
       * @param {object} [params]
       * @return {string}
       */
      getPlainMessage: function getPlainMessage (key, params) {
        return getErrorString(this.mergedMessages, key, params)
      }
    }
  };

  var singleErrorExtractorMixin = {
    props: {
      /**
       * A generic label that is shown as a Label above the input and replaces the attribute placeholder if not provided.
       * @type {string}
       */
      label: { type: String, default: '' },
      /**
       * Replaces the {attribute} placeholder in the error message fields.
       * @type {string}
       */
      attribute: { type: String, default: '' },
      /**
       * Used to find the attribute and validator of the field when used with a FormWrapper component.
       * @type {string}
       */
      name: { type: String, default: '' },
      /**
       * Params that are passed for the validation.
       * @type { Object.<string, (string|number)> }
       * Example: {other: $t('auth.password')} when using a sameAs validation and we need a translated "other" field.
       */
      validatorParams: {
        type: Object,
        default: function () { return ({}); }
      },
      /**
       * Whether to show only one error at a time
       * @type {boolean}
       */
      showSingleError: {
        type: Boolean,
        default: false
      }
    },
    extends: baseErrorsMixin,
    computed: {
      /**
       * Returns the appropriate validator based on provided validator props, injected validator and so on.
       * @return {object}
       */
      preferredValidator: function preferredValidator () {
        // if validator is passed is present on propsData, user has explicitly provided it.
        if (this.$options.propsData.hasOwnProperty('validator')) { return this.validator }
        return this.name ? get(this.formValidator, this.name, this.validator) : this.validator
      },
      /**
       * Returns an array of possible error objects
       * @return {any[]}
       */
      errors: function errors () {
        var this$1 = this;

        var vualidateParams = this.preferredValidator.$params;
        /** @type {Object.<string, { validationKey: string, params: { ext: string, vue: string }[]}>} */
        var remappedValidation = this.$vuelidateErrorExtractor.validationKeys || {};
        // Map all the params in the validator object. They correspond to every validation rule.
        return Object.keys(vualidateParams).map(function (validationRuleKey) {
          var vuelidateValidatorObject = vualidateParams[validationRuleKey];
          // Check of we have defined our validation remap in the settings
          if (remappedValidation.hasOwnProperty(validationRuleKey)) {
            var params$1 = remappedValidation[validationRuleKey].params.reduce(function (all, paramKey) {
              // Use the extra supplied data via validator-params prop or use the one from vuelidate
              all[paramKey.ext] = this$1.validatorParams[paramKey.vue] || vuelidateValidatorObject[paramKey.vue];
              return all
            }, {});
            return getValidationObject.call(this$1, remappedValidation[validationRuleKey].validationKey, validationRuleKey, params$1)
          }
          var params = Object.assign({}, vuelidateValidatorObject, this$1.validatorParams);
          delete params.type;
          // We are using the Vuelidate keys
          return getValidationObject.call(this$1, validationRuleKey, validationRuleKey, params)
        })
      },
      /**
       * Generic helper object to assign events easier.
       * @return {{ input: function }}
       */
      events: function events () {
        var this$1 = this;

        return { input: function () { return this$1.preferredValidator.$touch(); } }
      },
      /**
       * Returns true if field is dirty and has no errors, else null
       * @return {?Boolean}
       */
      isValid: function isValid () {
        return this.preferredValidator.$dirty ? !this.hasErrors : null
      },
      /**
       * Returns the attribute property depending on provided props - label, attribute, name etc.
       * @return {string}
       */
      resolvedAttribute: function resolvedAttribute () {
        // if an attribute is provided, just return it as its with highest priority
        if (this.attribute) { return this.$_VEE_hasI18n ? this.$t(this.attribute) : this.attribute }
        // if there is no name prop, we cant reach into the attributes object, so we use the label instead
        if (!this.name) { return this.label }
        return resolveAttribute.call(this, this.$vuelidateErrorExtractor.i18nAttributes, this.$vuelidateErrorExtractor.attributes, this.name)
      }
    }
  };

  //

  var script = {
    mixins: [singleErrorExtractorMixin],
    computed: {
      attributes: function attributes () {
        return {
          class: { 'is-invalid-input': this.hasErrors }
        }
      }
    }
  };

  /* script */
              var __vue_script__ = script;
              
  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "form-group", class: { error: _vm.hasErrors } },
      [
        _vm._t("label", [
          _vm.label
            ? _c("label", { class: { "is-invalid-label": _vm.hasErrors } }, [
                _vm._v(_vm._s(_vm.label) + " " + _vm._s(_vm.errors ? "*" : ""))
              ])
            : _vm._e()
        ]),
        _vm._v(" "),
        _vm._t("default", null, {
          attributes: _vm.attributes,
          errorMessages: _vm.activeErrorMessages,
          errors: _vm.activeErrors,
          events: _vm.events,
          firstErrorMessage: _vm.firstErrorMessage,
          hasErrors: _vm.hasErrors,
          validator: _vm.preferredValidator
        }),
        _vm._v(" "),
        _vm._t(
          "errors",
          [
            _vm.hasErrors
              ? _c(
                  "div",
                  { staticClass: "form-error is-visible" },
                  [
                    _vm.showSingleError
                      ? _c(
                          "div",
                          {
                            attrs: {
                              "data-validation-attr": _vm.firstError.validationKey
                            }
                          },
                          [
                            _vm._v(
                              "\n        " +
                                _vm._s(_vm.firstErrorMessage) +
                                "\n      "
                            )
                          ]
                        )
                      : _vm._l(_vm.activeErrorMessages, function(error, index) {
                          return _c(
                            "div",
                            {
                              key: _vm.activeErrors[index].validationKey,
                              attrs: {
                                "data-validation-attr":
                                  _vm.activeErrors[index].validationKey
                              }
                            },
                            [
                              _vm._v(
                                "\n          " + _vm._s(error) + "\n        "
                              )
                            ]
                          )
                        })
                  ],
                  2
                )
              : _vm._e()
          ],
          {
            errors: _vm.activeErrors,
            errorMessages: _vm.activeErrorMessages,
            hasErrors: _vm.hasErrors,
            firstErrorMessage: _vm.firstErrorMessage
          }
        )
      ],
      2
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = undefined;
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* component normalizer */
    function __vue_normalize__(
      template, style, script$$1,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "D:\\web\\public-projects\\vuelidate-error-extractor\\src\\templates\\single-error-extractor\\foundation6.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var foundation6 = __vue_normalize__(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      undefined,
      undefined
    );

  //

  var script$1 = {
    mixins: [singleErrorExtractorMixin],
    computed: {
      attributes: function attributes () {
        return {
          class: { 'form-control': true },
          name: this.name || undefined
        }
      }
    }
  };

  /* script */
              var __vue_script__$1 = script$1;
              
  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        staticClass: "form-group",
        class: { "has-error": _vm.hasErrors, "has-success": _vm.isValid }
      },
      [
        _vm._t("label", [
          _vm.label
            ? _c("label", { staticClass: "control-label" }, [
                _vm._v(
                  "\n      " +
                    _vm._s(_vm.label) +
                    " " +
                    _vm._s(_vm.errors ? "*" : "") +
                    "\n    "
                )
              ])
            : _vm._e()
        ]),
        _vm._v(" "),
        _vm._t("default", null, {
          attributes: _vm.attributes,
          errors: _vm.activeErrors,
          events: _vm.events,
          firstErrorMessage: _vm.firstErrorMessage,
          hasErrors: _vm.hasErrors,
          validator: _vm.preferredValidator
        }),
        _vm._v(" "),
        _vm._t(
          "errors",
          [
            _vm.hasErrors
              ? _c(
                  "div",
                  { staticClass: "help-block" },
                  [
                    _vm.showSingleError
                      ? _c(
                          "span",
                          {
                            attrs: {
                              "data-validation-attr": _vm.firstError.validationKey
                            }
                          },
                          [
                            _vm._v(
                              "\n        " +
                                _vm._s(_vm.firstErrorMessage) +
                                "\n      "
                            )
                          ]
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    !_vm.showSingleError
                      ? _vm._l(_vm.activeErrors, function(error) {
                          return _c(
                            "span",
                            {
                              key: error.validationKey,
                              attrs: {
                                "data-validation-attr": error.validationKey
                              }
                            },
                            [
                              _vm._v(
                                "\n          " +
                                  _vm._s(
                                    _vm.getErrorMessage(
                                      error.validationKey,
                                      error.params
                                    )
                                  ) +
                                  "\n        "
                              )
                            ]
                          )
                        })
                      : _vm._e()
                  ],
                  2
                )
              : _vm._e()
          ],
          {
            errors: _vm.activeErrors,
            errorMessages: _vm.activeErrorMessages,
            hasErrors: _vm.hasErrors,
            firstErrorMessage: _vm.firstErrorMessage
          }
        )
      ],
      2
    )
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    var __vue_inject_styles__$1 = undefined;
    /* scoped */
    var __vue_scope_id__$1 = undefined;
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* component normalizer */
    function __vue_normalize__$1(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "D:\\web\\public-projects\\vuelidate-error-extractor\\src\\templates\\single-error-extractor\\bootstrap3.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var bootstrap3 = __vue_normalize__$1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      undefined,
      undefined
    );

  //

  var script$2 = {
    name: 'Bootstrap4',
    mixins: [singleErrorExtractorMixin],
    computed: {
      attributes: function attributes () {
        return {
          class: { 'form-control': true, 'is-invalid': this.hasErrors, 'is-valid': this.isValid },
          name: this.name || undefined
        }
      }
    }
  };

  /* script */
              var __vue_script__$2 = script$2;
              
  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _vm._t("label", [_c("label", [_vm._v(_vm._s(_vm.label))])]),
        _vm._v(" "),
        _vm._t("default", null, {
          attributes: _vm.attributes,
          errors: _vm.activeErrors,
          events: _vm.events,
          firstErrorMessage: _vm.firstErrorMessage,
          hasErrors: _vm.hasErrors,
          validator: _vm.preferredValidator
        }),
        _vm._v(" "),
        _vm._t(
          "errors",
          [
            _vm.hasErrors
              ? _c(
                  "div",
                  {
                    class: {
                      "invalid-feedback": _vm.hasErrors,
                      "valid-feedback": !_vm.hasErrors
                    }
                  },
                  [
                    _vm.showSingleError
                      ? [_vm._v(_vm._s(_vm.firstErrorMessage))]
                      : _vm._l(_vm.activeErrorMessages, function(errorMessage) {
                          return _c("div", { key: errorMessage }, [
                            _vm._v(
                              "\n          " + _vm._s(errorMessage) + "\n        "
                            )
                          ])
                        })
                  ],
                  2
                )
              : _vm._e()
          ],
          {
            errors: _vm.activeErrors,
            errorMessages: _vm.activeErrorMessages,
            hasErrors: _vm.hasErrors,
            firstErrorMessage: _vm.firstErrorMessage
          }
        )
      ],
      2
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    var __vue_inject_styles__$2 = undefined;
    /* scoped */
    var __vue_scope_id__$2 = undefined;
    /* module identifier */
    var __vue_module_identifier__$2 = undefined;
    /* functional template */
    var __vue_is_functional_template__$2 = false;
    /* component normalizer */
    function __vue_normalize__$2(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "D:\\web\\public-projects\\vuelidate-error-extractor\\src\\templates\\single-error-extractor\\bootstrap4.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var bootstrap4 = __vue_normalize__$2(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      undefined,
      undefined
    );

  var singleErrorExtractor = {
    foundation6: foundation6,
    bootstrap3: bootstrap3,
    bootstrap4: bootstrap4
  };

  var multiErrorExtractorMixin = {
    props: {
      attributes: {
        type: Object,
        default: function () { return ({}); }
      }
    },
    extends: baseErrorsMixin,
    computed: {
      /**
       * Returns the preferred validator based on the provided validator props, the injected validator and so on.
       * @return {object}
       */
      preferredValidator: function preferredValidator () {
        // if validator prop is passed, we use it, else we use the injected one.
        if (this.$options.propsData.hasOwnProperty('validator')) { return this.validator }
        return this.formValidator
      },

      /**
       * Merge the global attributes and the locally provided ones
       * @return {Object.<string,string>}
       */
      mergedAttributes: function mergedAttributes () {
        if (this.$_VEE_hasI18n && this.$_VEE_hasI18nAttributes) {
          return Object.assign({}, this.$vuelidateErrorExtractor.i18nAttributes, this.attributes)
        }
        return Object.assign({}, this.$vuelidateErrorExtractor.attributes, this.attributes)
      },

      /**
       * Shallow array of all the errors for the provided validator
       * @return {VeeFlatMultiErrorBag}
       */
      errors: function errors () {
        var this$1 = this;

        return flattenValidatorObjects(this.preferredValidator).map(function (error) {
          return Object.assign({}, error, {
            params: Object.assign({}, error.params, {
              attribute: this$1.getResolvedAttribute(error.fieldName)
            })
          })
        })
      },

      /**
       * Returns if the form has any errors
       * @return {boolean}
       */
      hasErrors: function hasErrors () {
        return !!this.activeErrors.length
      }
    },
    methods: {
      /**
       * Returns the attribute's value, checking for i18n mode.
       * @param {string} fieldName - Validation field name.
       * @return {string}
       */
      getResolvedAttribute: function getResolvedAttribute (fieldName) {
        return resolveAttribute.call(this, this.mergedAttributes, this.mergedAttributes, fieldName)
      }
    }
  };

  //

  var script$3 = {
    name: 'baseMultiErrorExtractor',
    extends: multiErrorExtractorMixin
  };

  /* script */
              var __vue_script__$3 = script$3;
              
  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      _vm._l(_vm.activeErrorMessages, function(error, index) {
        return _c(
          "div",
          { key: index },
          [
            _vm._t("default", [_c("div", [_vm._v(_vm._s(error))])], {
              errorMessage: error,
              error: _vm.activeErrors[index]
            })
          ],
          2
        )
      })
    )
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    var __vue_inject_styles__$3 = undefined;
    /* scoped */
    var __vue_scope_id__$3 = undefined;
    /* module identifier */
    var __vue_module_identifier__$3 = undefined;
    /* functional template */
    var __vue_is_functional_template__$3 = false;
    /* component normalizer */
    function __vue_normalize__$3(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "D:\\web\\public-projects\\vuelidate-error-extractor\\src\\templates\\multi-error-extractor\\baseMultiErrorExtractor.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var baseMultiErrorExtractor = __vue_normalize__$3(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      undefined,
      undefined
    );

  //

  var script$4 = {
    inheritAttrs: false,
    components: {
      baseMultiErrorExtractor: baseMultiErrorExtractor
    }
  };

  /* script */
              var __vue_script__$4 = script$4;
              
  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "base-multi-error-extractor",
      _vm._b(
        {
          staticClass: "has-error",
          scopedSlots: _vm._u([
            {
              key: "default",
              fn: function(ref) {
                var errorMessage = ref.errorMessage;
                return [
                  _c("label", { staticClass: "help-block" }, [
                    _vm._v(_vm._s(errorMessage))
                  ])
                ]
              }
            }
          ])
        },
        "base-multi-error-extractor",
        _vm.$attrs,
        false
      )
    )
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    var __vue_inject_styles__$4 = undefined;
    /* scoped */
    var __vue_scope_id__$4 = undefined;
    /* module identifier */
    var __vue_module_identifier__$4 = undefined;
    /* functional template */
    var __vue_is_functional_template__$4 = false;
    /* component normalizer */
    function __vue_normalize__$4(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "D:\\web\\public-projects\\vuelidate-error-extractor\\src\\templates\\multi-error-extractor\\bootstrap3.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var bootstrap3$1 = __vue_normalize__$4(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      undefined,
      undefined
    );

  //

  var script$5 = {
    inheritAttrs: false,
    components: {
      baseMultiErrorExtractor: baseMultiErrorExtractor
    }
  };

  /* script */
              var __vue_script__$5 = script$5;
              
  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "base-multi-error-extractor",
      _vm._b(
        {
          staticClass: "was-validated",
          scopedSlots: _vm._u([
            {
              key: "default",
              fn: function(ref) {
                var errorMessage = ref.errorMessage;
                return [
                  _c("label", { staticClass: "invalid-feedback d-block" }, [
                    _vm._v(_vm._s(errorMessage))
                  ])
                ]
              }
            }
          ])
        },
        "base-multi-error-extractor",
        _vm.$attrs,
        false
      )
    )
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    var __vue_inject_styles__$5 = undefined;
    /* scoped */
    var __vue_scope_id__$5 = undefined;
    /* module identifier */
    var __vue_module_identifier__$5 = undefined;
    /* functional template */
    var __vue_is_functional_template__$5 = false;
    /* component normalizer */
    function __vue_normalize__$5(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "D:\\web\\public-projects\\vuelidate-error-extractor\\src\\templates\\multi-error-extractor\\bootstrap4.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var bootstrap4$1 = __vue_normalize__$5(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      undefined,
      undefined
    );

  //

  var script$6 = {
    inheritAttrs: false,
    components: {
      baseMultiErrorExtractor: baseMultiErrorExtractor
    }
  };

  /* script */
              var __vue_script__$6 = script$6;
              
  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "base-multi-error-extractor",
      _vm._b(
        {
          staticStyle: { "margin-top": "1rem" },
          scopedSlots: _vm._u([
            {
              key: "default",
              fn: function(ref) {
                var errorMessage = ref.errorMessage;
                return [
                  _c("label", { staticClass: "form-error is-visible" }, [
                    _vm._v(_vm._s(errorMessage))
                  ])
                ]
              }
            }
          ])
        },
        "base-multi-error-extractor",
        _vm.$attrs,
        false
      )
    )
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

    /* style */
    var __vue_inject_styles__$6 = undefined;
    /* scoped */
    var __vue_scope_id__$6 = undefined;
    /* module identifier */
    var __vue_module_identifier__$6 = undefined;
    /* functional template */
    var __vue_is_functional_template__$6 = false;
    /* component normalizer */
    function __vue_normalize__$6(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "D:\\web\\public-projects\\vuelidate-error-extractor\\src\\templates\\multi-error-extractor\\foundation6.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var foundation6$1 = __vue_normalize__$6(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      undefined,
      undefined
    );

  var multiErrorExtractor = {
    baseMultiErrorExtractor: baseMultiErrorExtractor,
    bootstrap3: bootstrap3$1,
    bootstrap4: bootstrap4$1,
    foundation6: foundation6$1
  };

  var FormWrapper = {
    name: 'FormWrapper',
    props: {
      validator: {
        type: Object,
        required: true
      },
      messages: {
        type: Object,
        default: function () { return ({}); }
      }
    },
    render: function render (h) {
      return h('div', this.$slots.default)
    },
    provide: function provide () {
      return {
        formValidator: this.validator,
        formMessages: this.messages
      }
    }
  };

  var index = {
    singleErrorExtractor: singleErrorExtractor,
    multiErrorExtractor: multiErrorExtractor,
    FormWrapper: FormWrapper
  };

  var laravel = {
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
  };

  var index$1 = {
    laravel: laravel
  };

  function plugin (Vue, opts) {
    if ( opts === void 0 ) opts = {};

    var options = {
      i18n: opts.i18n || false,
      i18nAttributes: opts.i18nAttributes,
      messages: opts.messages || {},
      validationKeys: opts.validationKeys || {},
      attributes: opts.attributes || {},
      name: opts.name || 'formGroup'
    };
    {
      if (typeof options.i18n !== 'string' && options.i18n !== false) {
        throw Error(("[vuelidate-error-extractor] options.i18n should be false or a string, " + (options.i18n) + " given."))
      }
      if (typeof options.i18n === 'string' && Object.keys(options.attributes).length && options.i18nAttributes === undefined) {
        console.error('[vuelidate-error-extractor] when using "i18n" mode, prefer using "i18nAttributes" option instead of "attributes"');
      }
    }
    Vue.prototype.$vuelidateErrorExtractor = options;
    if (typeof opts.template !== 'undefined') {
      Vue.component(options.name, opts.template);
    }
  }

  var version = '2.4.0';

  exports.default = plugin;
  exports.singleErrorExtractorMixin = singleErrorExtractorMixin;
  exports.multiErrorExtractorMixin = multiErrorExtractorMixin;
  exports.configs = index$1;
  exports.templates = index;
  exports.version = version;

  return exports;

}({}));
