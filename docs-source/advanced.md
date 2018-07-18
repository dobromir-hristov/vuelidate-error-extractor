---
title: Advanced Examples
---
# Using with Scoped Slots
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

* **Validator** - the validator object that the `form-group` uses. It will pick between the component validator or the injected one from the form-wrapper.
* **Attributes** - various attributes that are needed for the input. Classes, name fields etc. This is totally optional but each template has little quirks. Bootstrap4 for example requires classes to indicate validation success or failure.
* **Events** - this is a shorter version of the `@input="$v.form.field.$touch()"`. You can skip it if you don't need it.


# i18n

**Vuelidate-error-extractor** can be used with **vue-i18n** to provide error message translation.

To enable the i18n mode, you have to pass a string containing the top structure of your validation messages. 
E.g.
If your validations are looking like this:

```js
const message = {
  en: {
    validation:{
      required: 'The {attribute} field is required',
      email: 'The {attribte} field contains an invalid email address'
    }
  },
  de: {
    // ...
  }
}
```

Then when initializing your plugin you have to set up like this:

```js
Vue.use(VuelidateErrorExtractor, {
  template,
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
        vue: 'eq', // Vuelidate uses eq for other value 
        ext: 'other' // Laravel uses other
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
  :validatorParams="{ other: $t('auth.password') }">
    <input type="text" v-model="password_confirm">
</form-group>
```

Now if we have used `validationKeys` as well we get `The :attribute and :other must match.`  transformed to `The Password Confirmation and Password must match.`

## Usage with other plugins

You can of course use **vuelidate-error-extractor** with pretty much any input you want.

### Usage with Multiselect
Lets try with [Multiselect](http://monterail.github.io/vue-multiselect/)

```html
  <form-group :validator="$v.sports" label="Favourite Sports">
    <multiselect v-model='sports' :options='sports_array' @input='$v.sports.$touch()'></multiselect>
  </form-group> 
```

<p data-height="400" data-theme-id="0" data-slug-hash="PKjxvr" data-default-tab="result" data-user="dobromir" data-embed-version="2" data-pen-title="Vuelidate-error-extractor with Multiselect" class="codepen">See the Pen <a href="https://codepen.io/dobromir/pen/PKjxvr/">Vuelidate-error-extractor with Multiselect</a> by Dobromir (<a href="https://codepen.io/dobromir">@dobromir</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### Usage with quasar

You could use it with [Quasar](http://quasar-framework.org/components/input.html) as well, because we support scoped slots, we can make use of them.

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
  <form-group>
    <template slot-scope="{ hasErrors, firstErrorMessage, isValid }">
      <q-input 
        v-model="text" 
        :error="hasErrors" 
        :float-label="!isValid ? firstErrorMessage : 'Everything fine now'" />
    </template>
  </form-group>
```
