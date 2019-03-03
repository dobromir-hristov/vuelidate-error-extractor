---
title: Getting started
---

## Installation

**Vuelidate-error-extractor** can be used with bundlers like Webpack/Rollup/Parcel or directly with CDN in the browser, but is strongly advised and preferred to use the bundler approach.

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
  /**
   * Optionally provide the template in the configuration. 
   * or register like so Vue.component("FormField", templates.singleErrorExtractor.foundation6)
   */
  template: templates.singleErrorExtractor.foundation6, // you can also pass your own custom template
  messages: { required: "The {attribute} field is required" }, // error messages to use
  attributes: { // maps form keys to actual field names
    email: "Email",
    first_name: "First name",
    last_name: "Last name"
  }
});
```

Now you can use it in your components as shown below.

```vue
<template>
  <form @submit.prevent="submitForm">
    <h1>Awesome form</h1>
    <form-group :validator="$v.form.username" label="Username">
      <input type="text" v-model="form.username" @input="$v.form.username.$touch()">
    </form-group>
  </form>
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

By default, the error extractor component is registered as `<form-group>`, but it can be changed. See [Initialization Options - name](./installation.md#initialization-options) for more info.

## Exported objects

**Vuelidate-error-extractor** exports a few things, but you can import them separately from their files if your bundles include more than what you use (don't get tree shaken).

- **default** - The default export that installs the plugin in Vue.
- **templates** - Object containing different templates that are supported out of the box.
  - **singleErrorExtractor** - The available singleErrorExtractor templates 
    - foundation6 - Foundation 6 singleErrorExtractor template
    - bootstrap3 - Bootstrap 3 singleErrorExtractor template
    - bootstrap4 - Bootstrap 4 singleErrorExtractor template
  - **multiErrorExtractor** - The available multiErrorExtractor templates 
    - baseMultiErrorExtractor - A base multiErrorExtractor component, that is used to create a custom styled multi error extractor.
    - bootstrap3 - Bootstrap 3 multiErrorExtractor template
    - bootstrap4 - Bootstrap 4 multiErrorExtractor template
    - foundation6 - Foundation 6 multiErrorExtractor template
  - **FormWrapper** - The FormWrapper component. See [FormWrapper](./form_wrapper.md)
- **singleErrorExtractorMixin** - Used for building your own single field error template. See [single error extractor](single_error_extractor.md).
- **multiErrorExtractorMixin** - Used for building your own summary form errors template. See [multi error extractor](multi_error_extractor.md)
- **configs** - Object remapping vuelidate rules to another system's messages, like Laravel's. [Using Validation Keys](./advanced.md#validation-keys)

## Initialization Options

When installing Vuelidate-error-extractor there are just a few options required.

| Option         | Type          | Required   | Description                                                                                                                                                                                                                       |
| -------------- | ------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| template       | Vue Component | optional   | **singleErrorExtractor** field template. It registers the component globally for you. You can do it yourself via `Vue.component('formGroup', template)`. Custom templates should implement the `singleErroExtractorMixin` mixin.  |
| i18n           | String        | optional\* | Path to your validation error messages in your translation file. See [Advanced](./advanced.md#i18n) for more info.                      |
| messages       | Object        | optional\* | The messages from which to extract each validation rule error message. Optional if using i18n mode, otherwise required.                                                                                                           |
| validationKeys | Object        | optional   | Allows remapping validation rule keys and their props. See [Using Validation Keys](./advanced.md#validation-keys)                                                                                                                 |
| name           | String        | optional   | The name under which to register the **Single Error Extractor** template. Defaults to **formGroup**.                                                                                                                              |
| attributes     | Object        | optional   | A map of input field names. Used when displaying error messages for specific fields that display the name of the field. See [FormWrapper - Reusable Attributes](./form_wrapper.md#reusable-attributes)                     |
| i18nAttributes | Object        | optional   | A dictionary of input field names. Used when displaying error messages for specific fields that display the name of the field. See [FormWrapper - Reusable Attributes](./form_wrapper.md#reusable-attributes)                     |

## Direct Download/CDN

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The link below will always point to the latest release on NPM. You can also use a specific version/tag via URLs like `https://unpkg.com/vuelidate-error-extractor@0.0.1-alpha.0/dist/vuelidate-error-extractor.js`

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

<iframe height='265' scrolling='no' title='Vuelidate-error-extractor in Browser' src='//codepen.io/dobromir/embed/OjgVNx/?height=265&theme-id=0&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/dobromir/pen/OjgVNx/'>Vuelidate-error-extractor in Browser</a> by Dobromir (<a href='https://codepen.io/dobromir'>@dobromir</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Recap

**This was the absolute minimum to use the plugin.**

The two main installation properties you should provide are `template` and `messages`.

- `template` tells the plugin to use the template you provide. We currently give you 3 out of the box, but you can use your own.
- `messages` is the collection of error messages corresponding to each of your validation rule names.

To create your own templates, see [Custom Template](custom_templates.md)
