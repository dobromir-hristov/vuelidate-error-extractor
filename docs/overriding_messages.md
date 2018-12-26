---
title: Overriding error messages
---
# Overriding messages
Often times we use the same error messages for specific validation rules through out the whole website for consistency sake.

There are times however, when we want to be able to provide custom error messages for specific cases, for example a more detailed error, describing why that rule is applied.

This can be achieved in a two ways:
  * By providing a unique validation rule name in the `validations` definition and defining a specific message for it
  * By providing an error message override locally on the form field.

## Using unique validation rule name
Using the unique validation method we need to define the validation with an unique name that we specify a message for

Example validation messages

```json
{
  "validations": {
    "required": "The {attribute} field is required",
    "required_newsroom_name": "The {attribute} shows how people see your Newsroom in your profile and must be filled in."
  }
}
```
Example component validation definition
```js
import { required, email } from 'vuelidate/lib/validators'
export default {
   validations: {
     form: {
       newsroom_name: { required_newsroom_name: required },
       email: { required, email }
     }
   }
 }
```
Now when the `newsroom_name` is not filled in, it will show the longer `required_newsroom_name` error message.
  
## Using messages prop
We can also override error messages for certain fields or for whole forms by providing a messages prop.

### Overriding plain text error messages
When working with none translatable error messages, overriding error messages is a matter of just providing an object with the validation rule as a key and the error message as value:

```vue
<template>
  <form-group
    :validator="$v.form.name" 
    :messages="{ required: 'Please fill in the Name field' }"
    label="User Name" 
  >
    <input type="text" v-model="form.name">
  </form-group>
</template>
```

If we want to override validation messages for the whole form, we can leverage the `FormWrapper` component, and provide the new messages as a messages prop:

```vue
<template>
  <form-wrapper 
    :validator="$v.form" 
    :messages="messagesOverride"
  >
    <form-group 
      :messages="{ required: 'Cannot continue without filling a name' }"
      label="User Name" 
      name="name" 
    >
      <input type="text" v-model="form.name">
    </form-group>
    <form-group label="Email" name="email">
      <input type="email" v-model="form.email">
    </form-group>
  </form-wrapper> 
</template>
<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      form: {
        name: '',
        email: ''
      },
      messagesOverride: { 
        required: "You must fill the {attribute} field to continue",
        email: "The email must be a genuine email address."
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
</script>
```

From the example above we can see that the `required` message provided to the FormWrapper is used for all fields, however we can override that even further on a component level.

<iframe src="https://codesandbox.io/embed/l5mlw34l5m?view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> Note! Keep in mind that FormSummary a.k.a. MultiErrorExtractor components cannot know what error message you have overridden directly on fields, so it will use the error messages
that are defined globally, or overrides via a FormWrapper component.

### Overriding i18n messages
When working with translatable error messages, we need to provide an object with the validation rule as a key and the path via dot notation to the new validation message as its value.

```vue
<template>
  <form-group
    :validator="$v.form.name" 
    :messages="{ required: 'components.registration_form.user_required_validation' }"
    :label="$t('forms.user_name')" 
  >
    <input type="text" v-model="form.name">
  </form-group>
</template>
```

Using the above shown method, we can provide override messages to the whole form via the `FormWrapper` component and still provide per component overrides.
