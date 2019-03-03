---
title: Form Wrapper
---

# Form Wrapper

The FormWrapper component is used to pass a validator object to all error extractor elements inside it, no matter how deeply nested. 
This works with both the `Single Error Extractor` and the `Multi Error Extractor`, allowing the user to skip passing the validator object to each form field. You can even skip passing the `attribute` property as it can be extracted automatically.

## Preparation
You need to register the FormWrapper as a new Vue component. How you name it is up to you.

```js
import { templates } from 'vuelidate-error-extractor'

// This will register the component globally
Vue.component('FormWrapper', templates.FormWrapper)
```

You can also register the FormWrapper component locally just for a component.

```js
import { templates } from 'vuelidate-error-extractor'

export default {
  components: {
    FormWrapper: templates.FormWrapper
  }
}
```

### Reusable Attributes

To benefit from automatic `attribute` extraction, define an `attributes` option in your Vuelidate-error-extractor initial setup.

That way fields with the same name like **email** or **name** can get automatically replaced with **E-mail** or **User Name** in your error messages.

## Usage

```vue
<template>
  <div>
    <form-wrapper :validator="$v.form" :messages="localMessages">
      <form-errors/>
      <form-group name="name">
        <input type="text" v-model="form.name">
      </form-group>
      <form-group name="email">
        <input type="email" v-model="form.email">
      </form-group>
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
  validations: {
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

### Single Error Extractor
The `singleErrorExtractor` requires а **name** prop to be passed when used with the `FormWrapper`. The `name` prop is a string, equal to that field's key inside the form object, essentially the one that we are binding `v-model` to.

That way the `singleErrorExtractor` can reach into the `FormWrapper` and get the appropriate validations.

#### Bonus 
When you add the `name` prop, the `attribute` placeholder inside error messages is extracted from the `attributes` global object. 

### Multi Error Extractor

When the `MultiErrorExtractor` is used inside the `FormWrapper`, it requires no props what so ever. The `validator` prop is injected automatically.

## How it works
The `FormWrapper` is a component that has no markup, just a slot that renders everything passed to it. 
It expects one prop, `validator` that it passes down to all the error extractor components via the provide/inject API. 
