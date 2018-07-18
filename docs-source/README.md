---
title: Vuelidate-error-extractor
---
<p align="center">
<img :src="$withBase('/logo.svg')" width=150 alt="foo">
</p>

<h1 align="center">Vuelidate Error Extractor 2</h1>

<p align="center">
<a href="https://www.npmjs.com/package/vuelidate-error-extractor"> <img src="https://img.shields.io/npm/v/vuelidate-error-extractor.svg"/></a>
<a href="https://vuejs.org/"> <img src="https://img.shields.io/badge/vue-2.x-brightgreen.svg"/></a>
<a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg"/></a>
</p>

**Vuelidate-error-extractor** makes error message display from [Vuelidate](https://github.com/monterail/vuelidate) a breeze.
Display errors for a single form field or all the errors in a form summed up.

## Key features
* :rocket: **Easy** to use
* :boom: **Flexible** - can be tailored to fit your needs
* :fire: **Optional templates** - yey **mixins** and **slots**!!!
* :punch: **No extra styling** mucking your own
* :muscle: **Tested**

Error messages can be styled to fit either [Foundation 6](http://foundation.zurb.com/sites/docs/forms.html), [Bootstrap 3](https://getbootstrap.com/docs/3.3/css/#forms) and [Bootstrap 4](https://getbootstrap.com/docs/4.1/components/forms/#server-side) styles out of the box, or can be totally customized via your own custom templates.

The plugin is also able to work as a standalone component or in tandem with [vue-i18n](https://github.com/kazupon/vue-i18n) - see [Using with vue-i18n](advanced.md#i18n).

## Example 
<iframe src="https://codesandbox.io/embed/mo6v8nrmpp?autoresize=1&module=%2Fsrc%2Fcomponents%2FExampleForm.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Upgrade Guide
Version 2 added some breaking changes. Instead of reaching into templates directly for the predefined templates, 
you need to go into either `templates.singleErrorExtractor` or `templates.multiErrorExtractor`. Everything else is backwards compatible.

```js
import VuelidateErrorExtractor, { templates } from 'vuelidate-error-extractor'
Vue.use(VuelidateErrorExtractor, {
  template: templates.singleErrorExtractor.foundaton6
})
```

[MIT](http://opensource.org/licenses/MIT)
