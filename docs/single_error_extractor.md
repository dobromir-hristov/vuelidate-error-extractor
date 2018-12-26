---
title: Single Error Extractor
---

# Single Error Extractor
The Single Error Extractor is a component that displays the errors for a single form input. It can be used to wrap plain html form inputs or any custom Vue component.

It can receive a validator object from a `FormWrapper` component, see [Using a Form Wrapper](form_wrapper.md) or via a local validator prop. 

It does not come with any special styling or templates, it leaves that to the developers. We do however provide prebuilt ones for Foundation6, Bootstrap3 and Bootstrap4.

Providing custom templates and styling can be done by implementing the `singleErrorExtractorMixin` into your component. We intentionally went with the mixin approach as every CSS framework has its own very specific form field markup and a slot approach would not work for every case.

## Preparation
No special preparation is necessary. The single error extractor component is usually registered when initiating the VuelidateErrorExtractor plugin via the `template` option.u

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
<form-group 
  :validator="$v.first_name" 
  label="User's First Name" 
  attribute="First Name"
>
  <input type="text" v-model="first_name"/>
</form-group>
```

Passing a `messages` prop can allow for overriding the globally defined error messages with ones just for this component. Perfect for when you want a specific validation message that is not applicable anywhere else.

```vue
<template>
  <form-group 
    :validator="$v.first_name" 
    :messages="localMessages"
    label="User's First Name" 
    attribute="Name" 
  >
    <input type="text" v-model="first_name"/>
  </form-group>
</template>
<script>
export default {
  data() {
    return {
      first_name: '',
      localMessages: { 
        required: 'Field {attribute} should be filled in.' 
      }
    }
  },
  validations: {
    first_name: { required }
  }
}
</script>
```

The validation error message for the required rule will be `Field Name should be filled in.` instead of the globally defined one.

### Using with FormWrapper
If used with the `FormWrapper` component, you don't need to pass the `validator` prop any more as it will get auto injected, you only need to provide a `name` prop.
That will be used to both find the appropriate validation rules for the current field, inside the form `validator` object, as well as try to find this field's `{attribute}` name for replacing in the error message.

```vue
<form-wrapper :validator="$v.form">
  <form-group name="username">
    <input type="text" v-model="form.username">
  </form-group>
</form-wrapper>
```
Checkout the [Using a FormWrapper](form_wrapper.md) section to see how to use the FormWrapper component.

## Component Props

| Prop            | Type             | Required  | Description                                                                                                                                                                                                                                         |
| --------------- | ---------------- | --------  | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label           | String           | optional  | The label to use inside the template. Gets assigned to the `:attribute` prop if its not provided.                                                                                                                                                   |
| validator       | Vuelidate object | required  | The vuelidate object to pass for each input element. E.g. for the `username` data property you will have to pass `$v.username`.                                                                                                                     |
| messages        | Object           | optional  | A collection of local error messages that have precedence over the globally defined ones. This comes in handy when you need to override or set a single use case message. Check [Overriding Messages](./overriding_messages.md) for more examples.  |
| validatorParams | Object           | optional  | Extra parameters that override or add data to the validation message. Mostly used to provide additional parameters for validation messages. [Validator Params](./advanced.md#validator-params)                                                      |
| name            | String           | optional  | The name of the current field in the `validator` object. Used with the `FormWrapper` component. For nested objects use object paths like `address.street.first`. Also used to fetch the attribute from the globally provided `attributes`.          |
| showSingleError | Boolean          | optional  | Allows display of one error at a time.                                                                                                                                                                                                              |
