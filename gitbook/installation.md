#Installation

Vuelidate-error-extractor can be used with bundlers like Webpack/Rollup or in the browser, but is strongly advised to prefer the bundle approach.

> We will be using ES6 syntax for all of our examples

## Using Bundlers

```js
import Vue from 'vue'
import vuelidate from 'vuelidate'
import vuelidateErrorExtractor, { elements } from '../dist/vuelidate-error-extractor.esm'

Vue.use(vuelidate)
Vue.use(vuelidateErrorExtractor, {
  template: elements.foundation,
  messages: { required: 'The {attribute} field is required' },
})
```
Now you can use it in your components

```html
  // Somewhere in your vue components.
  ...
  <form-group :validator="$v.someValue" label="Some Input">
    <input type="text" v-model="someValue" @input="$v.someValue.$touch()">
  </form-group>
  ...
```

## Direct Download/CDN

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vuelidate-error-extractor@0.0.0/dist/vuelidate-error-extractor.js


```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vuelidate-error-extractor/dist/vuelidate-error-extractor.js"></script>
```

This is the absolute minimum to use the plugin. 

The two main properties you should provide are `template` and `messages`.
 - `template` tells the plugin to use the template you provide. We currently give you 2 out of the box.
 - `messages` is the collection of error messages corresponding to each of your validation types.

You can create your own templates, see [Custom Template](custom_templates.md) 

