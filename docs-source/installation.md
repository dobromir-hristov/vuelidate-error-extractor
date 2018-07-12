---
title: Getting started
---

## Installation

**Vuelidate-error-extractor** can be used with bundlers like Webpack/Rollup or in the browser, but is strongly advised and preferred to use the bundler approach.

> We will be using ES6 syntax for all of our examples

## With Webpack

```
npm i vuelidate-error-extractor -S
```

```js
// main.js
import Vue from "vue";
import vuelidate from "vuelidate";
import vuelidateErrorExtractor, { templates } from "vuelidate-error-extractor";

Vue.use(vuelidate);
Vue.use(vuelidateErrorExtractor, {
  template: templates.singleErrorExtractor.foundation6, // optional
  messages: { required: "The {attribute} field is required" },
  attributes: {
    email: "Email",
    first_name: "First name",
    last_name: "Last name"
  }
});
```

Now you can use it in your components

```vue
<template>
  <div>
    <form-group :validator="$v.form.username" label="Username">
      <input type="text" v-model="form.username" @input="$v.form.username.$touch()">
    </form-group>
  </div>
</template>
<script>
import { required, minLength } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  validations: {
    form: {
      username: { required },
      password: { required, minLength: minLength(6) }
    }
  }
};
</script>
```

## Exported objects

**Vuelidate-error-extractor** exports a few things, but you can import them separately from their files if your bundles include more than what you use (don't get tree shaken).

- default - The default export that installs the plugin in Vue.
- templates - Object containing different templates that are supported out of the box.
- singleErrorExtractorMixin - Used for building your own single field error template. See [single error extractor](single_error_extractor.md).
- multiErrorExtractorMixin - Used for building your own summary form errors template. See [multi error extractor](multi_error_extractor.md)
- configs - Object remapping vuelidate rules to another system's messages, like Laravel's. [Using Validation Keys](./advanced.md#validation-keys)

## Initialization Options

When installing Vuelidate-error-extractor there are just a few options that are optional but recommended to setup.

| Option         | Type          | Required   | Description                                                                                                                                                                                                    |
| -------------- | ------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| template       | Vue Component | optional   | **Single Error field template**. It just registers it for you, same as doing `Vue.component('formGroup', template)`. Should implement the `singleErroExtractorMixin` mixin.                                    |
| messages       | Object        | optional\* | The messages from which to extract each validation rule message. Required if not using i18n.                                                                                                                   |
| i18n           | String        | optional\* | Pass a path to your translated messages array that will be used to access them. Usage of [vue-i18n](https://github.com/kazupon/vue-i18n) package is assumed. See [Advanced](./advanced.md#i18n) for more info. |
| validationKeys | Object        | optional   | Allows remapping validation keys and props. See [Using Validation Keys](./advanced.md#validation-keys)                                                                                                         |
| name           | String        | option     | The name under which to register the **Single Error field template**. Defaults to **formGroup**                                                                                                                |

## Direct Download/CDN

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vuelidate-error-extractor@0.0.1-alpha.0/dist/vuelidate-error-extractor.js

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.0/vue.js"></script>
<script src="https://unpkg.com/vuelidate/dist/vuelidate.min.js"></script>
<script src="https://unpkg.com/vuelidate/dist/validators.min.js"></script>
<script src="https://unpkg.com/vuelidate-error-extractor/dist/vuelidate-error-extractor.js"></script>
```

```js
Vue.use(VuelidateErrorExtractor.default, {
  template: VuelidateErrorExtractor.templates.singleErrorExtractor.foundation6,
  messages: {
    required: "Field is required"
  }
});

const vueInstance = new Vue({
  el: "#app",
  data() {
    return {
      test: ""
    };
  },
  validations: {
    test: {
      required: validators.required
    }
  }
});
```

Inside your component

```html
  <form-group :validator="$v.test" label="Test Field">
    <input type="text" v-model="test" @input="$v.test.$touch()">
  </form-group>
```

<iframe height='265' scrolling='no' title='Vuelidate-error-extractor in Browser' src='//codepen.io/dobromir/embed/OjgVNx/?height=265&theme-id=0&default-tab=html,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/dobromir/pen/OjgVNx/'>Vuelidate-error-extractor in Browser</a> by Dobromir (<a href='https://codepen.io/dobromir'>@dobromir</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Recap

**This was the absolute minimum to use the plugin.**

The two main installation properties you should provide are `template` and `messages`.

- `template` tells the plugin to use the template you provide. We currently give you 2 out of the box, but you can use your own.
- `messages` is the collection of error messages corresponding to each of your validation rule names.

To create your own templates, see [Custom Template](custom_templates.md)
