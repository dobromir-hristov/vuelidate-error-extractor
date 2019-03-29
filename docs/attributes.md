# Attribute mapping

Attributes in Vuelidate-error-extractor are placeholders, that tell you which field the error message relates to.

```
The {attribute} field is required => The Email field is required
```

Attributes are used to give context to error messages, allowing for reusability of messages. They can be supplied by a few ways:

## None translatable attributes

To get most of this feature, its advisable to define an `attributes` key upon initialisation of the plugin. It must be a map of attribute keys to field names. 
Vuelidate-error-extractor will then use them to match and replace placeholders inside error messages with real field names.

By using this method, you will define these attributes globally through out the entire app, reducing boilerplate per input field. 

```js
Vue.use(vuelidateErrorExtractor, {
  template: templates.singleErrorExtractor.foundation6,
  messages: {
    required: 'Field {attribute} is required',
    email: 'Field {attribute} is not a valid email field'
  },
  attributes: {
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    'address.street': 'Street',
    'address.city': 'City',
    'address.postal': 'Postal Code',
    'phones.model': 'Phone Model'
  }
})
```

Now for each `FormGroup` you can just provide a `name` prop, with the name of the field. Usually that name will be the key the field is defined by in your `form` object. If there is a match in the `attributes` map, it will use it's value as a placeholder value in the error messages.

```vue
<form-group 
  :validator="$v.first_name" 
  name="first_name"
>
  <input type="text" v-model="first_name"/>
</form-group>
```

### Overriding

Overriding a globally defined attribute can be useful for cases where a more detailed field name is needed inside the error message.

#### SingleErrorExtractor attribute override

For SingleErrorExtractor, you can use the `attribute` prop to pass a new field name, enforcing a different attribute just for this field.

```vue
<form-group 
  :validator="$v.first_name" 
  attribute="First Name"
>
  <input type="text" v-model="first_name"/>
</form-group>
```

#### MultiErrorExtractor attribute override

For MultiErrorExtractor, you can use the `attributes` prop to change attributes for more than one field, by passing an map of attribute key and field name.

The `attributes` prop gets merged with the globally defined attributes, taking precedence for conflicting keys.

```vue
<base-multi-error-extractor 
  :validator="$v.form"
  :attributes="{ name: 'Special User Name' }"
/>
```

## Translatable attributes

When you are using the `i18n` mode, it makes sense to have translatable field attributes. To do that you need to provide a map of attribute key and path to translation, as an `i18nAttributes` property in your plugin initialization.

By providing a `__default` key, you are telling the plugin where to look for in your locale files, if it cant find an attribute in the aforementioned map.

```js
Vue.use(VuelidateErrorExtractor, {
  i18n: 'validations',
  i18nAttributes: {
    __default: 'attributes',
    email: 'forms.email',
    first_name: 'general.first_name'
  },
  messages: {}
})
```

Now you can pass a `name` prop on each field, and the plugin will try to find an attribute with a key, matching the `name` prop.

If it cannot find a value inside `i18nAttributes`, it will try to assemble it's path from the `__default` definition.

**Example:** if you have a `password` field, it will try to combine it with the `__default` key, which in our case is **attributes**, resulting in `$t('attributes.password')`

```vue
<form-group 
  :validator="$v.first_name" 
  name="first_name"
>
  <input type="text" v-model="first_name"/>
</form-group>
```

### Overriding
 
#### SingleErrorExtractor attribute override

To override the attribute in the singleErrorExtractor, you must pass an already translated string to the `attribute` prop.

```vue
<form-group 
  :validator="$v.first_name" 
  :attribute="$t('forms.user.first_name')"
>
  <input type="text" v-model="first_name"/>
</form-group>
```

#### MultiErrorExtractor attribute override

To override attributes in the MultiErrorExtractor, you need to provide an `attributes` prop which is a map of attribute name as key and path to translation as value.

```vue
<base-multi-error-extractor 
  :validator="$v.form"
  :attributes="{ name: 'forms.special_name' }"
/>
```
