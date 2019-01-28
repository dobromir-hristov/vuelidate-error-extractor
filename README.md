<p align="center">
  <a align="center" href="https://www.npmjs.com/package/vuelidate-error-extractor" target="_blank">
    <img alt="Vuelidate-error-extractor logo" width=200 src="https://raw.githubusercontent.com/dobromir-hristov/vuelidate-error-extractor/master/docs/.vuepress/public/logo.jpg">
  </a>
</p>


<h2 align="center">Vuelidate Error Extractor</h1>

<p align="center">
<a href="https://www.npmjs.com/package/vuelidate-error-extractor"> <img src="https://img.shields.io/npm/v/vuelidate-error-extractor.svg"/></a>
<a href="https://vuejs.org/"> <img src="https://img.shields.io/badge/vue-2.x-brightgreen.svg"/></a>
<a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg"/></a>
</p>

**Vuelidate-error-extractor** makes error message display from vuelidate a breeze. Be it for a single form element or all displaying all the errors in a form.

## Key features
* :rocket: **Easy** to use
* :boom: **Flexible** - can be tailored to fit your needs
* :fire: **Optional templates** - yey **mixins** and **slots**!!!
* :punch: **No extra styling** mucking your own
* :muscle: **Tested**

Error messages can be styled to fit either [Foundation 6](http://foundation.zurb.com/sites/docs/forms.html), [Bootstrap 3](https://getbootstrap.com/docs/3.3/css/#forms) and [Bootstrap 4](https://getbootstrap.com/docs/4.1/components/forms/#server-side) styles out of the box, or can be totally customized via your own custom templates.

Vuelidate-error-extractor is also able to work with [vue-i18n](https://github.com/kazupon/vue-i18n) or any vue translation plugin as long as it exposes a `$t` function to the Vue prototype. We also support predefining custom validation messages for all components and overriding them per component.

## Example

See the Pen <a href="https://codepen.io/dobromir/pen/zdzqYX/">Vuelidate Error extractor Usage Example</a>

## Upgrade Guide
Version 2 added some breaking changes. Instead of reaching into templates directly for the predefined templates, 
you need to go into either `templates.singleErrorExtractor` or `templates.multiErrorExtractor`. Everything else is backwards compatible.

```js
import VuelidateErrorExtractor, { templates } from 'vuelidate-error-extractor'
Vue.use(VuelidateErrorExtractor, {
  template: templates.singleErrorExtractor.foundaton6
})
```

## Documentation
Documentation and examples can be found at http://dobromir-hristov.github.io/vuelidate-error-extractor/


## Changelog
Detailed changes for each release are documented in the [CHANGELOG.md](https://github.com/dobromir-hristov/vuelidate-error-extractor/blob/development/CHANGELOG.md).


## Issues
Please make sure to read the [Issue Reporting Checklist](https://github.com/dobromir-hristov/vuelidate-error-extractor/blob/development/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.


## Contribution
Please make sure to read the [Contributing Guide](https://github.com/dobromir-hristov/vuelidate-error-extractor/blob/development/CONTRIBUTING.md) before making a pull request.

## License

[MIT](http://opensource.org/licenses/MIT)
