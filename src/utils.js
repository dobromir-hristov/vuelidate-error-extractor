const idDev = process.env.NODE_ENV === 'development'

/**
 * Deeply fetch dot notated strings from object.
 * Has fallback if value does not exist
 * @param {String} string - Dot notated string
 * @param {Object} object - Object to traverse
 * @param {*} fallback - Fallback value
 * @return {*}
 */
export function get (string, object, fallback = '') {
  if (typeof string !== 'string') {
    idDev && console.warn(`Expected a string in the first argument, got ${typeof string}`)
    return fallback
  }

  if (typeof object !== 'object') {
    idDev && console.warn(`Expected an Object/Array in the second argument, got ${typeof object}`)
    return fallback
  }

  try {
    return string.split('.').reduce((obj, current) => obj[current] || '', object)
  } catch (err) {
    idDev && console.warn(`[vuelidate-error-extractor]: ${err}`)
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
    throw new TypeError(`Expected a string in the first argument, got ${typeof template}`)
  }

  if (typeof object !== 'object') {
    throw new TypeError(`Expected an Object/Array in the second argument, got ${typeof object}`)
  }
  const regx = /{(.*?)}/g

  return template.replace(regx, (_, key) => get(key, object) || '')
}

/**
 * Return the proper validation object
 * @param {String} validationKey - Key by which we will get the translation
 * @param {String} key - Key to get the error status from
 * @param {Object} params - All the extra params that will be merged with the Given validatorParams prop.
 * @return {Object}
 */
export function getValidationObject (validationKey, key = validationKey, params = {}) {
  return {
    validationKey,
    hasError: !this.validator[key],
    $params: this.validator.$params[key],
    // Add the label for the :attribute parameter that is used in most Laravel validations
    params: Object.assign({}, { attribute: this.label, label: this.label }, params, this.validatorParams)
  }
}
