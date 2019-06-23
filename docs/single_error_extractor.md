---
title: Single Error Extractor
---

# Single Error Extractor

The Single Error Extractor is a component that displays the errors for a single form input. It can be used to wrap plain html form inputs or any custom Vue component.

It must be provided a `validator` prop to be able to extract validation messages from it. You can also use it in tandem with `FormWrapper` component, to auto provide the validator. See [Using a Form Wrapper](form_wrapper.md) for more info.

It does not come with any special styling or templates, it leaves that to the developers. We do however provide prebuilt ones for Foundation6, Bootstrap3 and Bootstrap4.

Creating custom templates and styling them, can be done by adding the `singleErrorExtractorMixin` into your custom `FormGroup` component. 

## Preparation

No special preparation is necessary. The single error extractor component should be registered when initiating the **VuelidateErrorExtractor** plugin.

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

This is the basic usage of the provided `form-group` component. It should be passed a validator and optionally a label. The label is used to display a label above the component and optionally fill in the `{attribute}` placeholder in validation messages.

### Custom Attribute

If you decide to skip the label, the `{attribute}` param in error messaged will become empty. If you want to have a different attribute than the Label, pass an `attribute` prop. 

```vue
<form-group 
  :validator="$v.first_name" 
  label="User's First Name" 
  attribute="First Name"
>
  <input type="text" v-model="first_name"/>
</form-group>
```

### Custom Messages

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

If used with the `FormWrapper` component, you don't need to pass the `validator` prop any more as it will get auto injected, you only need to provide a `name` prop, that is equal to the key it is attached to inside the form object.

The `name` that you pass will be used to extract the appropriate validations for this field, as well as try to find this field's `attribute` name for replacing in the error message.

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
| validator       | Vuelidate object | required  | The **Vuelidate** validator object. E.g. for the `username` data property you will have to pass `$v.username`.                                                                                                                     |
| label           | String           | optional  | A label to show, usually above the input. Used as a fallback to the `attribute`, by default.                                                                                                                                                   |
| name            | String           | optional  | The name of the current field in the `validator` object. Used with the `FormWrapper` component. For nested objects use object paths like `address.street.first`. Also used to fetch the attribute from the globally provided `attributes`.          |
| messages        | Object           | optional  | A collection of local error messages that have precedence over the globally defined ones. This comes in handy when you need to override or set a single use case message. Check [Overriding Messages](./overriding_messages.md) for more examples.  |
| validatorParams | Object           | optional  | Extra parameters that override validator params, or add data for the validation message to show. Mostly used to provide additional parameters for validation messages. [Validator Params](./advanced.md#validator-params)                                                      |
| showSingleError | Boolean          | optional  | Allows display of one error at a time.                                                                                                                                                                                                              |
