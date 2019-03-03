---
title: Custom Templates
---
# Creating your own templates

## Single Error Extractor Component

If you have a custom template that you want to use (and you most probably do), then you can use the `singleErrorExtractorMixin`. It will give you all you need to display a single field's errors.

Below is an example implementation of such a template, using the provided by the mixin computed properties.

```vue
<template>
  <div class="form-group" :class="{ error: hasErrors }">
    <slot/>
    <div class="errors" v-if="hasErrors">
      <div class="error" v-for="error in activeErrorMessages">{{ error }}</div>
    </div>
  </div>
</template>

<script>
  import { singleErrorExtractorMixin } from 'vuelidate-error-extractor'
  
  export default {
    mixins: [singleErrorExtractorMixin]
  }
</script>
```

Now you can import the template and supply it to the initialize method's template option or register it yourself.

```js
import Vue from 'vue'
import vuelidate from 'vuelidate'
import vuelidateErrorExtractor from 'vuelidate-error-extractor'

import customFormGroup from './path/to/formGroup.vue'

Vue.use(vuelidate)
Vue.use(vuelidateErrorExtractor, {
  template: customFormGroup,
  messages: messages,
})
```

This is it. You can extend is as much as want, as long as you implement the `singleErrorExtractorMixin`.

### singleErrorExtractorMixin

The `singleErrorExtractorMixin` is a vue mixin that provides a few convenient methods and variables for your custom templates.

### Methods

| Method | Properties|  Returns | Description |
  |  --- | --- | --- | --- |
getErrorMessage| {String} key, {Object} properties | String | Gets the error message for the current key. Can be passed an object with additional properties for the validation message.

> Deeply nested objects can be passed as properties and accessed via dot notation e.g. 'Error message is {deeply.nested.obj.value}'
> Nested messages are also supported

### Computed properties

Property | Returns | Description
| --- | --- | --- |
errors | Object | Collection of validation [error objects](./custom_templates.md#error-object) for the field. Its a dynamic property, so its in sync with the form field's state. 
activeErrors | Object | Only the active error objects - those that are "dirty".
activeErrorMessages | Object | Only the active error messages.
mergedMessages | Object | Collection of messages, from both the local messages prop and the global messages.
firstError | Object | Returns the first active error object.
firstErrorMessage | String | Returns the first active error message.
hasErrors | Boolean | If field has any errors. 

### Error object

The `error` object has a structure like:

```json
  {
     "$params": {
        "min": 5
     },
     "$dirty": false,
     "$error": false,
     "$invalid": true,
     "validationKey": "minLength",
     "hasError": true,
     "params": {
       "attribute": "Username",
       "label": "Username",
       "min": 5
     }
  }
```

* **validationKey** - Key by which the messages are extracted. Could be deep dot notation - `min.string` resolves in `{ min: { string: 'Field is required' }}`

### SingleErrorExtractor Props

Prop | Type | Required | Description
  |  ---| --- | --- | ---|
 label | String | optional | The label to use inside the template. Gets assigned to the `:attribute` property as well.
 validator | Vuelidate object | required | The vuelidate object to pass for each input element. E.g. for the `test` data property you will have to pass `:validator = "$v.test"`.
 messages | Object | optional | The local messages to override the globally provided ones during initialization. This comes in handy when you need to override or its a single use case message. **Does not work with i18n mode!**
 validatorParams | Object | optional | Optional parameters to override or provide to the validation message. Mostly used to provide additional values like in the `other` property in laravel's `same` validation. [Validator Params](./advanced.md#validator-params)
 showSingleError | Boolean | optional | Whether to show only a the first active error or all of them.


## Multi Error Extractor component

Creating your own multi error component is super easy. You can use our `baseMultiErrorExtractor` to do that.

In fact that is how the Foundation6 multi error template is implemented.

```vue
<template>
  <base-multi-error-extractor v-bind="$attrs" style="margin-top: 1rem">
    <template slot-scope="{ errorMessage }">
      <label class="form-error is-visible">{{ errorMessage }}</label>
    </template>
  </base-multi-error-extractor>
</template>

<script>
import { templates } from 'vuelidate-error-extractor'

export default {
  inheritAttrs: false,
  components: {
    baseMultiErrorExtractor: templates.multiErrorExtractor.baseMultiErrorExtractor
  }
}
</script>
```

The scoped slot exposes both the full `error` object as well as the `errorMessage` string.

### multiErrorExtractorMixin

If you need even more customization, you can use the `multiErrorExtractorMixin`. 

It will provide similar props and computed properties as the `singleErrorExtractorMixin`.


### Methods

| Method | Properties|  Returns | Description |
  |  --- | --- | --- | --- |
getErrorMessage| {String} key, {Object} properties | String | Gets the error message for the current key. Can be passed an object with additional properties for the validation message.

### Computed properties

Property | Returns | Description
| --- | --- | --- |
errors | Object | All validation error objects for the form. Its a dynamic property so its in sync with the form's state. 
activeErrors | Object | The currently active error objects.
activeErrorMessages | Object | The currently active error messages.
mergedMessages | Object | Merges both the messages prop and the globally defined ones on init.
firstError | Object | Returns the first error object.
firstErrorMessage | String | Returns the first active error message.
hasErrors | Boolean | If field has any errors. 

### Props

Prop | Type | Required | Description
  |  ---| --- | --- | ---|
 validator | Vuelidate object | required | The vuelidate object to pass for each input element. E.g. for the `test` data property you will have to pass `:validator = "$v.test"`.
 messages | Object | optional | The local messages to override the globally provided ones during initialization. This comes in handy when you need to override the messages or its a single use case message. **Does not work with i18n mode!**
 attributes | Object | optional | Object containing `key:value` pairs of form field and field name. `{ name: 'User Name', first_name: 'First Name' }`. These get added as `{attribute}` props to each error object.

