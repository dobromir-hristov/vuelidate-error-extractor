export const validationObject = {
  'a': {
    'required': false,
    'minLength': true,
    '$invalid': true,
    '$dirty': false,
    '$error': false,
    '$pending': false,
    '$params': {
      'required': {
        'type': 'required'
      },
      'minLength': {
        'type': 'minLength',
        'min': 5
      }
    }
  },
  'b': {
    'required': false,
    'maxLength': true,
    '$invalid': true,
    '$dirty': false,
    '$error': false,
    '$pending': false,
    '$params': {
      'required': {
        'type': 'required'
      },
      'maxLength': {
        'type': 'maxLength',
        'max': 5
      }
    }
  },
  'deep': {
    'a': {
      'required': false,
      '$invalid': true,
      '$dirty': false,
      '$error': false,
      '$pending': false,
      '$params': {
        'required': {
          'type': 'required'
        }
      }
    },
    'b': {
      'required': false,
      '$invalid': true,
      '$dirty': true,
      '$error': true,
      '$pending': false,
      '$params': {
        'required': {
          'type': 'required'
        }
      }
    },
    '$invalid': true,
    '$dirty': false,
    '$error': false,
    '$pending': false,
    '$params': {
      'a': null,
      'b': null
    }
  },
  '$invalid': true,
  '$dirty': false,
  '$error': false,
  '$pending': false,
  '$params': {
    'a': null,
    'b': null,
    'deep': null
  }
}
export const flattenedValidatorObject = [
  {
    $dirty: false,
    $error: false,
    $invalid: true,
    hasError: true,
    propName: 'a',
    validationKey: 'required',
    params: {}
  },
  {
    $dirty: false,
    $error: false,
    $invalid: true,
    hasError: false,
    propName: 'a',
    validationKey: 'minLength',
    params: { min: 5 }
  },
  {
    $dirty: false,
    $error: false,
    $invalid: true,
    hasError: true,
    propName: 'b',
    validationKey: 'required',
    params: {}
  },
  {
    $dirty: false,
    $error: false,
    $invalid: true,
    hasError: false,
    propName: 'b',
    validationKey: 'maxLength',
    params: { max: 5 }
  },
  {
    $dirty: false,
    $error: false,
    $invalid: true,
    hasError: true,
    propName: 'deep.a',
    validationKey: 'required',
    params: {}
  },
  {
    $dirty: true,
    $error: true,
    $invalid: true,
    hasError: true,
    propName: 'deep.b',
    validationKey: 'required',
    params: {}
  }
]

export const errorMessages = {
  required: '{attribute} is required',
  minLength: '{ attribute } should be {min}',
  maxLength: '{ attribute } should be {max}'
}

export const i18nMessages = {
  en: {
    validation: {
      required: 'Field {attribute} is required',
      minLength: 'Field {attribute} should be at least {min} characters.',
      email: 'Field {attribute} is not a valid email address.'
    }
  }
}
