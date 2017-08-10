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

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vuelidate-error-extractor@0.0.1-alpha.0/dist/vuelidate-error-extractor.js

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.js"></script>
<script src="https://unpkg.com/vuelidate@0.5.0/dist/vuelidate.min.js"></script>
<script src="https://unpkg.com/vuelidate@0.5.0/dist/validators.min.js"></script>
<script src="https://unpkg.com/vuelidate-error-extractor/dist/vuelidate-error-extractor.js"></script>
```

```js
  Vue.use(vuelidate.default)
  
  Vue.use(VuelidateErrorExtractor.default, {
    template: VuelidateErrorExtractor.elements.foundation,
    messages: {
      required: 'Field is required'
    }
  })
  
  const vueInstance = new Vue({
    el: '#app',
    data () {
      return {
        test: ''
      }
    },
    validations: {
      test: {
        required: validators.required
      }
    }
  })
```

Inside your component

```html
  <form-group :validator="$v.test" label="Test Field">
    <input type="text" v-model="test" @input="$v.test.$touch()">
  </form-group>
```

<p data-height="265" data-theme-id="0" data-slug-hash="OjgVNx" data-default-tab="js,result" data-user="dobromir" data-embed-version="2" data-pen-title="Vuelidate-error-extractor in Browser" class="codepen">See the Pen <a href="https://codepen.io/dobromir/pen/OjgVNx/">Vuelidate-error-extractor in Browser</a> by Dobromir (<a href="https://codepen.io/dobromir">@dobromir</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

This is the absolute minimum to use the plugin. 

The two main properties you should provide are `template` and `messages`.
 - `template` tells the plugin to use the template you provide. We currently give you 2 out of the box.
 - `messages` is the collection of error messages corresponding to each of your validation types.

You can create your own templates, see [Custom Template](custom_templates.md) 

