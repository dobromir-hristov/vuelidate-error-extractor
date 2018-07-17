---
title: Form Wrapper
---

# Form Wrapper

The FormWrapper component is used to pass a validator object to all error extractor elements inside it, no matter how deeply nested. 
This works with both the `Single Error Extractor` and the `Multi Error Extractor`, allowing the user to skip passing the validator object to each form field.

## Preparation
You need to register the FormWrapper as a new Vue component. How you name it is up to you.

```js
import { templates } from 'vuelidate-error-extractor'

// This will register the component globally
Vue.component('FormWrapper', templates.formWrapper)
```
You can also register the FormWrapper component locally just for a component by passing it to the `components` key on the Vue component that needs it.

To get the most benefit, provide the `attributes` options inside the Vuelidate-error-extractor initial setup.
That way fields with the same name like **email** or **name** will get properly mapped to **E-mail** or **User Name**.

## Usage

```vue
<template>
  <div>
    <form-wrapper :validator="$v.form" :messages="localMessages">
      <form-errors/>
      <form-field name="name">
        <input type="text" v-model="form.name">
      </form-field>
      <form-field name="email">
        <input type="email" v-model="form.email">
      </form-field>
    </form-wrapper>
  </div>
</template>
<script>
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      form: {
        name: "",
        email: ""
      },
      localMessages: {
        email: '{attribute} is not a proper email, you should check it again.'
      }
    };
  },
  validation: {
    form: {
      name: { required },
      email: { required, email }
    }
  }
};
</script>
```

You have to pass the `validator` prop which is your form object's Vuelidate validation. 
Its a good practice to wrap your forms in an object like so:

```js
export default {
  data() {
    return {
      form: {
        name: '',
        email: ''
      }
    }
  },
  validations: {
    form: {
      name: { required },
      email: { required, email }
    }
  }
}
```
By adding a `messages` prop, you can override the globally defined messages. 

::: warning
Does not work in i18n mode for now!
:::

### Single Error Extractor
When using with the `SingleErrorExtractor` component, its required to pass а **name** prop to each error extractor. That is a string representing the field's key in the form.

That way the `singleErrorExtractor` can look into the `formWrapper` validator and get the proper validations.
 
Using the `name` prop, the error message `attribute` is guessed from the global `$vuelidateErrorExtractor.attributes` object. 

### Multi Error Extractor

When the `FormWrapper` is used with the `MultiErrorExtractor`, the later requires no props what so ever. The extractor becomes a prop-less component. See the example above.

## How it works
The `FormWrapper` is a component that has no markup, just a slot that renders everything passed to it. 
It expects one prop, `validator` that it passes down to all the error extractor components via the provide/inject API. 
