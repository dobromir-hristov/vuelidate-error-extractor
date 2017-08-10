#i18n

Vuelidate-error-extractor can be used with vue-18n to provide translated error messages.

To enable the i18n mode, you have to pass a string containing the top structure of your validation messages. 
E.g.
If your validations are coming from Laravel
```js
{
  en: {
    validation:{
      required: 'The {attribute} field is required',
      email: 'The {attribte} field contains an invalid email address'
    }
  },
  de: {
    ...
  }
}
```
Then when initializing your plugin you have to set up like this:
```js
Vue.use(VuelidateErrorExtractor, {
  tempalate,
  messages,
  i18n: 'validation' // Where validation is the key under which all validation messages are contained. Can be deeper nested if needed.
})
```
Now **vuelidate-error-extractor** will use `$t('validation.required')` to output a required error message for the current language.

## Validation keys
Validation keys is a special hatch that lets you map more complex error messages to vuelidate's simpler tree structure.
E.g.
Laravel uses deeper  structures for some of it's validation messages. 
```php
[
    'min' => [
        'numeric' => 'The :attribute must be at least :min.',
        'file'    => 'The :attribute must be at least :min kilobytes.',
        'string'  => 'The :attribute must be at least :min characters.',
        'array'   => 'The :attribute must have at least :min items.',
    ],
]
```
We are forced to use strange validation rule names like `min.string` or easy way around this is to map the differences with the validationKeys option.
```js
const validationKeys = {
  minLength: { // Validation rule name in vuelidate
    validationKey: 'min.string', // Validation key inside our deep messages object, Laravel shown here.
    params: [
      {
        vue: 'min', // Vuelidate param name
        ext: 'min' // Messages param name
      }
    ]
  },
  sameAs: {
    validationKey: 'same',
    params: [
      {
        vue: 'eq',
        ext: 'other'
      }
    ]
  }
}
Vue.use(VuelidateMessageExtractor, {
  template,
  i18n: 'validation',
  validationKeys
})

```
This way you can easily remap them without fiddling with the provided translated validation messages, in this case Laravel.

## Validator Params

This is another escape hatch for those moments where you need to provide a parameter which applies only for the current component.
A really good example is the `same` validation. Laravel implements this via `same` message, where as Vuelidate has a `sameAs` rule. Even if we call ours `same:sameAs('password')` the parameter names don't match as vuelidate uses `eq` and laravel `other`.
To solve our issue, we just provide a small map with the params we want to provide:
```html
<form-group 
  :validator="$v.password_confirm" 
  :label="$('auth.password_confirm')" 
  :validatorParams="{ other: $t('auth.password') }">
    <input type="text" v-model="password_confirm">
</form-group>
```
Now if we have used `validationKeys` as well we get `The :attribute and :other must match.`  transformed to `The Password Confirmation and Password must match.`
