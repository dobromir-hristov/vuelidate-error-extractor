export default {
  en: {
    validations: {
      required: 'The "{attribute}" field is required!',
      required_extended: 'The "{attribute}" field must be filled in!',
      required_further_extended: 'The "{attribute}" field must be filled in as its a required field!',
      minLength: 'The "{attribute}" needs to be at least {min} characters long',
      numeric: '"{attribute}" needs to be numeric.',
      min: {
        string: 'The "{attribute}" field must be at least {min} characters.'
      }
    },
    attributes: {
      test: 'test field',
      last_name: 'Last Name',
      email: 'Email',
      address: {
        street: 'Street',
        city: 'City',
        postal: 'Postal'
      },
      phones: {
        model: 'Phone Model',
        brand: 'Brand'
      }
    },
    attribute_override: {
      first_name: 'User First Name'
    },
    attribute_multi_extractor_override: {
      first_name: 'User First Name Overridden MultiExtractor'
    }
  },
  bg: {
    validations: {
      required: 'Полето "{attribute}" е задължително!',
      required_extended: 'Полето "{attribute}" трябва да бъде попълнено!',
      required_further_extended: 'Полето "{attribute}" е задължително и трябва да бъде попълнено!',
      minLength: 'Полето "{attribute}" трябва да бъде поне {min} символа',
      numeric: 'Полето "{attribute}" трябва да бъде числена стойност.',
      min: {
        string: 'Полето "{attribute}" трябва да има минимум {min} символа.'
      }
    },
    attributes: {
      test: 'Тестово',
      last_name: 'Фамилия',
      email: 'Имейл',
      address: {
        street: 'Улица',
        city: 'Град',
        postal: 'Пощенски код'
      },
      phones: {
        model: 'Модел на телефон',
        brand: 'Модел'
      }
    },
    attribute_override: {
      first_name: 'Първо име на потребителя'
    },
    attribute_multi_extractor_override: {
      first_name: 'Първо име на потребителя Заместено от MultiExtractor'
    }
  }
}
