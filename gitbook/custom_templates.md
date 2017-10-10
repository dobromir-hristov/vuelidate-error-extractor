# Creating your own templates

If you have a custom template that you want to provide (and you most probably do), then we have made it as easy as it can be.
{% raw %}
```html
<template>
  <div class="custom-element" :class="{error: validator.$error}">
    <slot></slot>
    <div class="errors" v-if="validator.$error">
      <div class="error" v-for="error in activeErrors">{{ getErrorMessage(error.validationKey, error.params) }}</div>
    </div>
  </div>
</template>
<script>
  import {extractorMixin} from 'vuelidate-error-extractor'
  
  export default {
    mixins: [extractorMixin]
  }
</script>
```
{% endraw %}

Now we need to import our newly created template and supply it to the init function.

```js
import customFormGroup from './components/form/formGroup.vue'
import Vue from 'vue'
import vuelidate from 'vuelidate'
import vuelidateErrorExtractor from 'vuelidate-error-extractor'

Vue.use(vuelidate)
Vue.use(vuelidateErrorExtractor, {
  template: customFormGroup,
  messages,
})
```

And this is it. You can extend is as much as want, as long as you implement the `extractorMixin`.

## extractorMixin

The `extractorMixin` is a vue mixin that provides a few convenient methods and variables for your custom templates.

### Methods

Method | Returns | Description
    --- | --- | --- |
`getErrorMessage({String} key, {Object} properties)` | String | Gets the error message for the current key. Can be passed an object with additional properties for the validation message. If i18n is set, it will return the translation string, skipping the messages prop.
`getI18nMessage({String} key, {Object} properties)` | String | Gets the u18n error message
`getPlainMessage({String} key, {Object} properties)` | String | Gets the plain error message

> Note that you can use deep objects and access them via 'Error message is {deeply.nested.obj.value}'
> Nested messages are also supported

### Computed properties

Property | Returns | Description
    --- | --- | --- |
errors | Object | Shows all the available validation messages for the field. This is a property that is updated every time the `validator` prop is updated, basically when an error state changes. 
activeErrors | Object | Filters the `errors` object and shows only the active errors.
mergedMessages | Object | Merges both the messages prop and the globally defined ones on init.
firstError | Object | Convenience method to return the first error object
firstErrorMessage | String | Convenience method to return the first error message
hasErrors | Boolean | If we have errors. 

The `errors` object has a structure like:
```js
[
  {
    $params:{Object},
    hasError:false,
    params:{
      attribute:"Username",
      label: "Username"
    },
    validationKey:"required"
  },
  {
     $params:{Object},
     hasError:true,
     params:{
       attribute:"Username",
       label:"Username",
       min: "5"
     },
     validationKey:"minLength" // could be deep dot notation - min.string
  }
]
```
Active errors is the same, with only the ones where `hasError` is set to true. 

## Props

Prop | Type | Required | Description
    ---| --- | --- | ---
 label | String | optional | The label to use inside the template. Gets assigned to the `:attribute` property as well.
 validator | Vuelidate object | required | The vuelidate object to pass for each input element. E.g. for the `test` data property you will have to pass `:validator = "$v.test"`.
 messages | Object | optional | The local messages to override the globally provided ones during initialization. This comes in handy when you need to override or its a single use case message. **Does not work with i18n mode!**
 validatorParams | Object | optional | Optional parameters to override or provide to the validation message. Mostly used to provide additional values like in the `other` property in laravel's `same` validation. [Validator Params](./advanced.md#validator-params)
 showSingleError | Boolean | optional | Whether to show only a the first active error or all of them.
