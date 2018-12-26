---
title: Multi Error Extractor
---

# Multi Error Extractor
The Multi Error Extractor is a component that displays all the errors of a form.

It can receive a validator object either from a direct prop or via a `FormWrapper`, see [Using a Form Wrapper](form_wrapper.md). 
An `attributes` prop cam be passed to identify each field's name in the form. Passing a local `attributes` prop will override the global `attributes`.

The component does not come with any special styling or markup. We do however provide optional prebuilt templates for Foundation6 and Bootstrap3.

Providing custom templates and styling can be done by either using the `baseMultiErrorExtractor` component or the `multiErrorExtractorMixin`. 
The `baseMultiErrorExtractor` loops all the errors and exposes a scoped slot with `error` and `error-message` params.

## Preparation
The `multiErrorExtractor` component is not registered by default. Import either one of the prebuilt templates or the baseMultiErrorExtractor and build your own.

```js
import { templates } from 'vuelidate-error-extractor'
Vue.component('form-errors', template.multiErrorExtractor.foundation6)
```

## Usage

This is the basic usage of a `multi-error-extractor` component. It should get passed a validator and an attributes object.
Attributes will map each error field by name to its `{attribute}` placeholder in the validation messages.

You can skip the `attributes` param and rely on the globally defined attributes on initialization. Make sure that either the local or global attributes are defined.
 
You can also provide a messages object that will override the globally defined messages. That allows for custom error messages, perfect when you want a specific validation message that is not applicable anywhere else. Check [Overriding Messages](./overriding_messages.md#using-messages-prop) for more examples.


```vue
<template>
  <form-summary 
    :validator="$v.form" 
    :messages="localMessages" 
    :attributes="attributes"
  />
</template>
<script>
  import { templates } from 'vuelidate-error-extractor'
  export default {
    components: { formSummary: templates.multiErrorExtractor.foundation6 },
    data () {
      return {
          form: {}, // form data
          localMessages: { // message overrides
            required: 'The {attribute} field must be filled in!'
          },
          attributes: {
            name: 'Full name',
            email: 'User Email'
          }
      }
    },
    validations: {} // some validation rules
  }
</script>
```

The required error message will be `Field Name should be filled in.` because we override it locally.

### Implementing your own

To implement your own Multi Error Extractor template, please checkout the [Creating Custom Components](custom_templates.md#multi-error-extractor-component) page.

### Using with FormWrapper

Similar to Single Error Extractors, when used with `FormWrapper` component, the `validator` prop is not needed any more. If you have the `{attributes}`  defined globally, you can rely on them, making the component prop-less.

Checkout the [Using a FormWrapper](form_wrapper.md) section to see how to use the FormWrapper component.

## Component Props

| Prop            | Type             | Required  | Description                                                                                                                                                                                                                         |
| --------------- | ---------------- | --------  | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attributes      | Object           | required* | The attributes object is a map of `field_name: Field Name` representing each field in the form with a proper title. Not required with FormWrapper component.   |
| validator       | Vuelidate object | required* | The vuelidate validator of a form object. Not required when used with FormWrapper component.                                                                   |
| messages        | Object           | optional  | A collection of local error messages that overwrite the global ones. Check [Overriding Messages](./overriding_messages.md#using-messages-prop) for more examples.                                                     |
