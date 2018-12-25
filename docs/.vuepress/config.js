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
    }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/favicons/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: '/favicons/safari-pinned-tab.svg', color: '#5bbad5' }],
    ['link', { rel: 'shortcut icon', href: '/favicons/favicon.ico' }],
    ['meta', { name: 'msapplication-TileColor', content: '#ffffff' }],
    ['meta', { name: 'msapplication-config', content: '/favicons/browserconfig.xml' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }]

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
      'advanced',
      'other_frameworks'
    ],
    repo: 'dobromir-hristov/vuelidate-error-extractor',
    editLinks: true,
    docsDir: 'docs'
  },
  ga: 'UA-29425482-9',
  base: '/vuelidate-error-extractor/'
}
