---
title: Single Error Extractor
---

# Single Error Extractor
The Single Error Extractor is a component that displays the errors of a single form input. It can be used with plain html inputs or with any custom components.

It can receive a validator from a `FormWrapper`, see [Using a Form Wrapper](form_wrapper.md) or a local validator object. It can also use global attribute defaults or local attribute overrides. 

It does not come with any special styling or templates, it leaves that to the developers. We do however provide prebuilt ones for Foundation6, Bootstrap3 and Bootstrap4.

Providing custom templates and styling can be done by implementing the `singleErrorExtractorMixin`. We intentionally went with the mixin approach as every CSS framework has its own very specific form field markup and a slot approach would not work for every case.

## Preparation
No special preparation is necessary. The single error extractor component is usually registered when initiating the VuelidateErrorExtractor plugin via the template option.

## Usage
```vue
<template>
  <div>
    <form-group :validator="$v.first_name" label="User's First Name">
      <input type="text" v-model="first_name"/>
    </form-group>
  </div>
</template>
```

This is the basic usage of a `form-group` component. It should get passed a validator and optionally a label. The label is used to display a label above the component and fill in the `{attribute}` placeholder in validation messages.

If you decide to skip the label, the `{attriute}` param in error messaged will become empty. If you want to have a different attribute than the Label, pass an attribute prop `attribute="First Name"`. 

```vue
<form-group :validator="$v.first_name" label="User's First Name" attribute="First Name">
  <input type="text" v-model="first_name"/>
</form-group>
```

Passing a `messages` prop can allow for custom error messages just for this component, perfect when you want a specific validation message that is not applicable anywhere else.

```vue
<template>
  <form-group :validator="$v.first_name" label="User's First Name" attribute="Name" :messages="localMessages">
    <input type="text" v-model="first_name"/>
  </form-group>
</template>
<script>
export default {
  data() {
      return {
          first_name: '',
          localMessages: { required: 'Field {attribute} should be filled in.' }
      }
  },
  validations: {
    first_name: { required }
  }
}
</script>
```


The required error message will be `Field Name should be filled in.` instead of the globally defined one.

### Using with FormWrapper
If used with the `FormWrapper` component, you don't need to pass the `validator` prop any more as it will get auto injected. What you must provide however is a `name` param.
That will be used to both find the appropriate field validator inside the main `validator` object as well as try to guess the `{attribute}` name of the field you are validating.

```vue
<form-wrapper :validator="$v.form">
  <form-field name="name">
    <input type="text" v-model="form.name">
  </form-field>
</form-wrapper>
```
Checkout the [Using a FormWrapper](form_wrapper.md) section to see how to use the FormWrapper component.

## Component Props

| Prop            | Type             | Required  | Description                                                                                                                                                                                                                         |
| --------------- | ---------------- | --------  | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label           | String           | optional  | The label to use inside the template. Gets assigned to the `:attribute` and `:label` properties as well.                                                                                                                            |
| validator       | Vuelidate object | required  | The vuelidate object to pass for each input element. E.g. for the `username` data property you will have to pass `<form-group :validator="$v.username">`.                                                                           |
| messages        | Object           | optional  | A collection of local error messages that have precedence over the global ones. This comes in handy when you need to override or set a single use case message. **Does not work with i18n mode!**                                   |
| validatorParams | Object           | optional  | Optional parameters to override or provide to the validation message. Mostly used to provide additional values like in the `other` property in laravel's `same` validation. [Validator Params](./advanced.md#validator-params)      |
| name            | String           | optional* | The name of the current field in the `validator` object when used with the `FormWrapper` component. For nested objects use like `address.street.first`. Also used to fetch the attribute from the globally provided `{attributes}`. |
| showSingleError | Boolean          | optional* | Whether to display one error at a time or all the errors.                                                                                                                                                                           |
