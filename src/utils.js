const idDev = process.env.NODE_ENV === 'development'

function formatErrorMessage (message) {
  return `[vuelidate-error-extractor]: ${message}`
}

export function warn (message) {
  idDev && console.warn(formatErrorMessage(message))
}

/**
 * Deeply fetch dot notated strings from object.
 * Has fallback if value does not exist
 * @param {String} string - Dot notated string
 * @param {Object} object - Object to traverse
 * @param {*} [fallback] - Fallback value
 * @return {*}
 */
export function get (object, string, fallback) {
  if (typeof string !== 'string') {
    warn(`Expected a string in the first argument, got ${typeof string}`)
    return fallback
  }

  if (typeof object !== 'object') {
    warn(`Expected an Object/Array in the second argument, got ${typeof object}`)
    return fallback
  }

  try {
    return string.trim().replace(/\[(\d+)]/g, '.$1').split('.').reduce((obj, current) => {
      if (!obj[current]) throw new Error(`The "${string}" could not be resolved in ${JSON.stringify(obj)} at key "${current}"`)
      return obj[current]
    }, object)
  } catch (err) {
    warn(err)
    return fallback
  }
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
    hasError: !this.validator[key],
    $params: this.validator.$params[key],
    $dirty: this.validator.$dirty,
    $error: this.validator.$error,
    $invalid: this.validator.$invalid,
    // Add the label for the :attribute parameter that is used in most Laravel validations
    params: Object.assign({}, {
      attribute: this.attribute || this.label,
      label: this.label
    }, params, this.validatorParams)
  }
}

export function flattenValidatorObjects (validator, propName) {
  return Object.entries(validator)
    .filter(([key, value]) => !key.startsWith('$'))
    .reduce((errors, [key, value]) => {
      // its probably a deeply nested object
      if (typeof value === 'object') {
        return errors.concat(flattenValidatorObjects(value, propName ? `${propName}.${key}` : key))
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
