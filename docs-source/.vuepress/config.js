module.exports = {
  head: [
    ['meta', { 'name': 'twitter:card', 'content': 'summary' }],
    ['meta', { 'name': 'twitter:site', 'content': '@d_m_hristov' }],
    ['meta', { 'name': 'twitter:title', 'content': 'Error message display from vuelidate with ease.' }],
    ['meta', {
      'name': 'twitter:description',
      'content': 'Vuelidate-error-extractor removes the repetition of showing vuelidate error messages.'
    }],
    ['meta', {
      'name': 'twitter:image',
      'content': 'https://dobromir-hristov.github.io/vuelidate-error-extractor/logo.jpg'
    }],
    ['meta', {
      'property': 'og:url',
      'content': 'https://dobromir-hristov.github.io/vuelidate-error-extractor/'
    }],
    ['meta', {
      'property': 'og:title',
      'content': 'Error message display from vuelidate with ease.'
    }],
    ['meta', {
      'property': 'og:description',
      'content': 'Vuelidate-error-extractor removes the repetition of showing vuelidate error messages.'
    }],
    ['meta', {
      'property': 'og:image',
      'content': 'https://dobromir-hristov.github.io/vuelidate-error-extractor/logo.jpg'
    }]
  ],
  title: 'Vuelidate-error-extractor',
  themeConfig: {
    logo: '/logo.svg',
    sidebar: [
      ['/', 'Home'],
      'installation',
      'single_error_extractor',
      'multi_error_extractor',
      'form_wrapper',
      'custom_templates',
      'advanced'
    ]
  },
  ga: 'UA-29425482-9',
  base: '/vuelidate-error-extractor/',
  dest: 'docs'
}
