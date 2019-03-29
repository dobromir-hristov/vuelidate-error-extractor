import getValue from '@d_hristov/get-value'

/**
 * Gets object values deeply by using a dot notation path
 * @param {object} obj
 * @param {string} path
 * @param {*} [def]
 * @return {*}
 */
export function get (obj, path, def) {
  return getValue(obj, path, { default: def })
}

function formatErrorMessage (message) {
  return `[vuelidate-error-extractor]: ${message}`
}

/**
 * Replace dot notated strings in curly braces for values
 * @param {String} template - Template to search
 * @param {Object} object - Object with data to traverse
 * @return {string}
 */
export function template (template, object) {
  if (typeof template !== 'string') {
    throw new TypeError(formatErrorMessage(`Expected a string in the first argument, got ${typeof template}`))
  }

  if (typeof object !== 'object') {
    throw new TypeError(formatErrorMessage(`Expected an Object/Array in the second argument, got ${typeof object}`))
  }
  const regx = /{(.*?)}/g

  return template.replace(regx, (_, key) => get(object, key, ''))
}

/**
 * Return the proper validation object
 * @param {String} validationKey - Key by which we will get the translation
 * @param {String} key - Key to get the error status from
 * @param {Object} params - All the extra params that will be merged with the Given validatorParams prop.
 * @return {Object}
 */
export function getValidationObject (validationKey, key, params = {}) {
  return {
    validationKey,
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
export function flattenValidatorObjects (validator, fieldName) {
  // loop the validator objects
  return Object.entries(validator)
  // leave those that dont have $ in their name with exception of $each
    .filter(([key, value]) => !key.startsWith('$') || key === '$each')
    .reduce((errors, [key, value]) => {
      // if its an object, its probably a deeply nested object
      if (typeof value === 'object') {
        const nestedValidatorName =
          // Key can be "$each", a "string" or a "number" from inside "$each".
          // If "key" is "$each" or a string (from a nested object like "address.postal_code"), use the passed fieldName as its a recursive call from previous call.
          (key === '$each' || !isNaN(parseInt(key))) ? fieldName
            // if fieldName is available, build it like `model.brand` from `model.$each.0.brand`.
            : fieldName ? `${fieldName}.${key}`
            // fallback to the "key" if "fieldName" is not available
            : key
        // recursively call the flatten again on the same error object, looking deep into it.
        return errors.concat(flattenValidatorObjects(value, nestedValidatorName))
      } // else its the validated prop
      const params = Object.assign({}, validator.$params[key])
      // delete type as it is coming for Vuelidate and may interfere with user custom attributes
      delete params.type
      errors.push({
        fieldName: fieldName,
        validationKey: key,
        hasError: !value,
        params,
        $dirty: validator.$dirty,
        $error: validator.$error,
        $invalid: validator.$invalid
      })
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
export function getErrorString (messages, key, params) {
  const msg = get(messages, key, false)
  if (!msg) {
    return key
  }
  return template(msg, params)
}

/**
 * Strip the "$each.0" from field names
 * @type {RegExp}
 */
const NORMALIZE_ATTR_REGEX = /\$each\.\d\./g

/**
 * Retrieves a validations attribute from the provided attributes object
 * @param {object} attributes - Map of attribute name as key to attribute value
 * @param {string} fieldName - The attribute key. Can be dot.notation.
 * @return {string}
 */
export function getAttribute (attributes, fieldName) {
  // strip out the $each and fetch the attribute from the attributes object. Return the name if it does exist on the object
  const normalizedName = fieldName.replace(NORMALIZE_ATTR_REGEX, '')
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
export function getI18nAttribute (attributes, fieldName) {
  // strip out the $each from the name
  const normalizedName = fieldName.replace(NORMALIZE_ATTR_REGEX, '')
  // fetches the attribute key from the i18nAttributes property. Can be dot.notation based.
  const attributeKey = get(attributes, normalizedName)
  // if there is such a key in the passed attributes param, we translate with it directly
  if (attributeKey) {
    return this.$t(attributeKey)
  } else {
    // We dont have the key defined and no __default attribute, so we just return the key so its not empty
    if (!this.$_VEE_i18nDefaultAttribute) {
      return normalizedName
    }
    // use the defaultAttribute to build the path to the attribute translation
    return this.$t(`${this.$_VEE_i18nDefaultAttribute}.${normalizedName}`)
  }
}

/**
 * Resolves the attribute depending if in i18n mode or not
 * @param {Object.<string, string>} i18nAttributes
 * @param {Object.<string, string>} attributes
 * @param {string} name - Validated field name. Dot.path based
 * @return {string}
 */
export function resolveAttribute (i18nAttributes, attributes, name) {
  // if its in 18n mode and has i18n attributes defined, extract them
  if (this.$_VEE_hasI18n && this.$_VEE_hasI18nAttributes) {
    return getI18nAttribute.call(this, i18nAttributes, name)
  } else {
    return getAttribute(attributes, name)
  }
}
