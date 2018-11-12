import getValue from '@d_hristov/get-value'

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

  return template.replace(regx, (_, key) => get(object, key) || '')
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

export function getAttribute (attributes, attribute, label, name = '') {
  if (attribute) return attribute
  if (!name) return label
  // strip out the $each
  const normalizedName = name.replace(/\$each\.\d\./g, '')
  return attributes[normalizedName] || normalizedName
}

export function flattenValidatorObjects (validator, propName) {
  return Object.entries(validator)
    .filter(([key, value]) => !key.startsWith('$') || key === '$each')
    .reduce((errors, [key, value]) => {
      // its probably a deeply nested object
      if (typeof value === 'object') {
        const nestedValidatorName =
          (key === '$each' || !isNaN(parseInt(key))) ? propName
            : propName ? `${propName}.${key}`
            : key
        return errors.concat(flattenValidatorObjects(value, nestedValidatorName))
      } // else its the validated prop
      const params = Object.assign({}, validator.$params[key])
      delete params.type
      errors.push({
        propName,
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

export function getErrorString (messages, key, params) {
  const msg = get(messages, key, false)
  if (!msg) {
    return key
  }
  return template(msg, params)
}
