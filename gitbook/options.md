# Available options

## Initialization Options
The available options that you can set when initializing the plugin are:

 Option | Type | Required | Description
    ---| --- | --- | ---
 template | Vue Component | required | The vue component to use. Should implement the `message-extractor-mixin`
 messages | Object | optional | The messages from which to extract each validation rule message. It is not needed if you use i18n
 i18n | String | optional | Forces the plugin to use the [vue-i18n](https://github.com/kazupon/vue-i18n) package to show translated messages. Must be set to the translation object's name as its used when getting the messages. E.g. `$t('validations.required')` where *validations* is the value of i18n. See [Advanced](./advanced.md#i18n)
 validationKeys | Object | optional | Allows to remap some of the keys and their properties. E.g. in Laravel's `same` validation rule, `other` is used to name the other field to compare, where as Vuelidate uses `eq`. [Using Validation Keys](./advanced.md#validation-keys)
 name | String | option |  The name under which to register the component. Defaults to **formGroup**

## Component Props

Prop | Type | Required | Description
    ---| --- | --- | ---
 label | String | optional | The label to use inside the template. Gets assigned to the `:attribute` and `:label` properties as well.
 validator | Vuelidate object | required | The vuelidate object to pass for each input element. E.g. for the `username` data property you will have to pass `<form-group :validator="$v.username">`.
 messages | Object | optional | A collection of local error messages that have precedence over the global ones. This comes in handy when you need to override or set a single use case message. **Does not work with i18n mode!**
 validatorParams | Object | optional | Optional parameters to override or provide to the validation message. Mostly used to provide additional values like in the `other` property in laravel's `same` validation. [Validator Params](./advanced.md#validator-params)
