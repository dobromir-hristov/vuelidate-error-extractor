---
title: Advanced Examples
---
## Using with Scoped Slots
If you really want to cut down on boilerplate, scoped slots are the way to go.

**Vuelidate-error-extractor** supports scoped slots from the beginning, but with version 2, they just got better.

```vue
<form-wrapper :validator="$v.nestedObject">
... other random content

<form-group name="first_name" label="First name">
  <template slot-scope="{ attributes, events }">
    <input
      v-bind="attributes"
      v-on="events"
      type="text"
      v-model="nestedObject.first_name">
  </template>
</form-group>

... other random content
</form-wrapper>
```

The default slot scope now gives us access to props like `validator`, `attributes` and `events`. 

* **validator** - the validator object that the `form-group` uses. It will pick between the component validator or the injected one from the form-wrapper.
* **attributes** - various attributes that are needed for the input. Classes, name fields etc. This is totally optional but each template has little quirks. Bootstrap4 for example requires classes to indicate validation success or failure.
* **events** - this is a shorter version of the `@input="$v.form.field.$touch()"`. You can skip it if you don't need it.

## Nested objects with $each
When you need to validate a nested set of objects, you can use the **$each** config keyword inside Vuelidate validations.

Lets say you have a list of phones and each phone should have a model number.

```js
export default {
  data () {
    return {
      phones: [
        {
          model: '',
        }
      ]
    }
   },
  validations: {
      phones: {
        $each: {
          model: { required }
        }
      }
   }
}
```

All you have to do now is tell vuelidate-error-extractor how to name that field in a human readable manner and which field to validate exactly.

Set inside the `attributes` initial setup object an entry like `'phones.model': 'Phone model'`. Now vuelidate-error-extractor will know that we want to validate a _Phone Model_ field.
 
Your field will look like this. Example uses the `form-wrapper`.

```vue
<form-wrapper :validator="$v">
  <form-group name="phones.$each.0.model">
      <input
        type="text"
        v-model="phones[0].model">
  </form-group>
</form-wrapper>

```

Under the hood it loops all the nested rules and it generates a path like `phones.$each.0.model`. That gets stripped out of **$each** and **index** so we can have attributes mapping - `phones.model` to **Phone Model**.

You can go as deep as you want `phones.$each.0.apps.$each.0.profiles.$each.0.name` corresponds to `phones.apps.profiles.name`.

## i18n

**Vuelidate-error-extractor** can be used with [vue-i18n](https://github.com/kazupon/vue-i18n) package to provide error message translations.

To enable the **i18n** mode, you have to pass a string leading to the path, where you define your validation messages in the translation file. 

### Example

Translation file might look like this:

```json
{
  "en": {
    "validation": {
      "required": "The {attribute} field is required",
      "email": "The {attribute} field contains an invalid email address"
    }
  },
  "de": {
    "validation": {
       // validation messages in german
     }
  }
}
```

When initializing your plugin you have to set up like this:

```js
Vue.use(VuelidateErrorExtractor, {
  template,
  i18n: 'validation' // Path to validation messages. Can be deeply.nested.property.
})
```
Now **vuelidate-error-extractor** will use the validation messages that match a validation rule, showing the appropriate messages for the current language.

## Validation keys

Validation keys is used to map deeply nested error messages to vuelidate's flatter validation rule names.

E.g.
Laravel uses deeper structures for some of it's validation messages. 

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

You would be forced to use strange validation rule names like `min.string` to map validator to an error message. Using ValidationKeys, it is just a hash map.

```js
const validationKeys = {
  minLength: { // Validation rule name in vuelidate
    validationKey: 'min.string', // Validation key inside our deep messages object, Laravel shown here.
    params: [
      {
        vue: 'min', // Vuelidate param name
        ext: 'min' // Parameter inside the message
      }
    ]
  },
  sameAs: {
    validationKey: 'same',
    params: [
      {
        vue: 'eq', // Vuelidate uses `eq` for other value 
        ext: 'other' // Laravel uses `other`
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

This way you can easily remap them without fiddling with the provided translated validation messages, in this case Laravel, or messing with your own rules.

## Validator Params

This is another escape hatch for those moments where you need to provide a parameter which applies only for the current component.

A really good example is the `same` validation. Laravel implements this via `same` message, where as Vuelidate has a `sameAs` rule. Even if we call ours `same:sameAs('password')` the parameter names don't match as vuelidate uses `eq` and laravel `other`.

To solve our issue, we just provide a small map with the params we want to provide:

```html
<form-group 
  :validator="$v.password_confirm" 
  :label="$('auth.password_confirm')" 
  :validator-params="{ other: $t('auth.password') }"
>
  <input type="text" v-model="password_confirm">
</form-group>
```

Now if we have used `validationKeys` as well, we get `The :attribute and :other must match.` transformed to `The Password Confirmation and Password must match.`

## Usage with other plugins

You can of course use **vuelidate-error-extractor** with pretty much any input element.

### Usage with Multiselect

Lets try with [Multiselect](http://monterail.github.io/vue-multiselect/)

```html
  <form-group :validator="$v.sports" label="Favourite Sports">
    <multiselect v-model='sports' :options='sports_array' @input='$v.sports.$touch()'/>
  </form-group> 
```

<p data-height="400" data-theme-id="0" data-slug-hash="PKjxvr" data-default-tab="result" data-user="dobromir" data-embed-version="2" data-pen-title="Vuelidate-error-extractor with Multiselect" class="codepen">See the Pen <a href="https://codepen.io/dobromir/pen/PKjxvr/">Vuelidate-error-extractor with Multiselect</a> by Dobromir (<a href="https://codepen.io/dobromir">@dobromir</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### Usage with Quasar

You could use it with [Quasar](http://quasar-framework.org/components/input.html) as well, and with scoped slots, we can provide the needed data.

We can create a new simple component to use with Quasar inputs.

```html
<!--form-group.vue-->
<template>
  <div
    class="form-group"
    :class="{ error: hasErrors }">
    <slot 
      :has-errors="hasErrors"
      :first-error-message="firstErrorMessage"
      :label="label"
      :isValid="isValid"
    />
  </div>
</template>
```

Pass scoped props to quasar's q-input
```html
  <form-group :validator="$v.form_name">
    <template slot-scope="{ hasErrors, firstErrorMessage, isValid }">
      <q-input 
        v-model="text" 
        :error="hasErrors" 
        :float-label="!isValid ? firstErrorMessage : 'Everything fine now'" />
    </template>
  </form-group>
```
