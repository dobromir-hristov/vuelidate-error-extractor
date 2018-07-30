# Usage with other frameworks

**Vuelidate-error-extractor** is really flexible and can be used with pretty much any Vue UI framework or CSS framework.

## Usage with ElementUI

ElementUI has its own validation scheme that uses AsyncValidator. You can however pass custom messages to its `el-form-item` component.

To do that, you will have to add an `el-form` wrapping component.

```vue
<el-form label-width="120px" size="mini">
  <form-group :validator="$v.sizeForm.name">
    <template slot-scope="{ firstErrorMessage }">
      <el-form-item label="Activity name" :error='firstErrorMessage'>
        <el-input v-model="sizeForm.name"></el-input>
      </el-form-item>
    </template>
  </form-group>
</el-form>
```

This works, but is a bit too much boilerplate for my taste.
 
I would rather wrap the `el-form-item` in an invisible component. That way we can skip 2 rows of boilerplate.

```vue
<template>
  <el-form-item v-bind="$attrs" :label="label" :error='firstErrorMessage'>
    <slot/>
  </el-form-item>
</template>
<script>
  import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
  export default {
    name: "el-form-item-extended", // or what ever you want
    extends: singleErrorExtractorMixin,
    inheritAttrs: false
  };
</script>

```

You can be more specific with the props that get assigned, but for simplicity this will do.

```vue
<el-form label-width="120px" size="mini">
  <el-form-item-extended label="Activity name" :validator="$v.sizeForm.name">
    <el-input v-model="sizeForm.name"/>
  </el-form-item-extended>
</el-form>
```

### Live ElementUI example

<iframe src="https://codesandbox.io/embed/yjy0v2x7rj?autoresize=1&module=%2Fsrc%2Fcomponents%2FExampleForm.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Usage with iView

iView uses the same mechanics and props as ElementUI.
Adapt the above example for it by using `Form` and `FormItem` components.

## Usage with Framework7

This one is а bit simpler. We just need a simple invisible wrapper.

```vue
<template>
  <div>
    <slot
      :attrs="{ errorMessage: firstErrorMessage, errorMessageForce: hasErrors }"
    />
  </div>
</template>
<script>
  import { singleErrorExtractorMixin } from 'vuelidate-error-extractor'
  export default {
    name: 'form-group', // or what ever you want
    extends: singleErrorExtractorMixin,
    inheritAttrs: false,
  }
</script>
```

Then we use it like so

```vue
<form-group :validator="$v.name">
  <template slot-scope="{ attrs }">
      <f7-input 
        type="text" 
        @input="name = $event.target.value" 
        placeholder="Enter number" 
        v-bind="attrs"
      />
  </template>
</form-group>
```

## Usage with Vuetify

Vuetify's `v-text-field` can be passed an `errorMessages` prop that is an array of error messages. 

We will pass our activeErrorMessages computed property to `v-text-field` via a scoped slot.

```vue
<template>
  <div>
    <slot
      :attrs="{ 
          errorMessages: activeErrorMessages,
          success: isValid
       }"
      :hasErrors="hasErrors"
    />
  </div>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  extends: singleErrorExtractorMixin
};
</script>
```

Now we can use it like so: 

```vue
<form-group  name="email">
  <template slot-scope="{ attrs }">
    <v-text-field
      v-bind="attrs"
      v-model="form.email"
      label="Email with wrapper"
      @input="$v.form.email.$touch()"
    />
  </template>
</form-group>
```


### Live Vuetify example

<iframe src="https://codesandbox.io/embed/v834qo51o7?autoresize=1&module=%2Fsrc%2Fcomponents%2FFormSummary.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Usage with MintUI

Mint-UI has only one field that supports validation state so its really easy to create a wrapper around it.

```vue
<template>
  <mt-field :v-bind="$attrs" :state="state" v-model="model"><slot/></mt-field>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  name: 'FormGroup',
  extends: singleErrorExtractorMixin,
  inheritAttrs: false,
  props: {
      value: {
          type: [Number, String],
          default: null
      }
  },
  computed: {
    model: {
        get () {
            return this.value
        },
        set (value) {
            this.preferredValidator.$touch()
            this.$emit('input', value)
        }
    },
    state () {
      return this.hasErrors ? 'error': 
      this.isValid ? 'success': 
      null
    }
  }
};
</script>
```

After we register the global component we can use it like so:
```vue
<form-group :validator="$v.form.name" v-model="form.name" label="Some label"/>
```

### Live MintUI example

<iframe src="https://codesandbox.io/embed/myrn9y85wx?autoresize=1&module=%2Fsrc%2Fcomponents%2FFormSummary.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Usage with MuseUI
This is very similar to how ElementUI and iView work but you pass an `error-text` prop.

```vue
<template>
  <mu-form-item v-bind="$attrs" :error-text="firstErrorMessage" :label="label">
    <slot/>
  </mu-form-item>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  extends: singleErrorExtractorMixin,
  inheritAttrs: false
};
</script>
```

```vue
<form-group :validator="$v.name" attribute="Name">
  <mu-text-field type="password" v-model="name" prop="name"/>
</form-group>
```

## Usage with Quasar

Quasar offers the `q-field` component, that has an error and a message prop. We can leverage those and create
an invisible wrapper around it.

```vue
<template>
  <q-field
    v-bind="$attrs"
    :label="label"
    :error="hasErrors"
    :error-label="firstErrorMessage"
  >
    <slot/>
  </q-field>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  name: "FormGroup",
  extends: singleErrorExtractorMixin,
  inheritAttrs: false
};
</script>
```

Then we can register it globally and use it with `q-input` or any other form element.
```vue
 <form-group 
    :validator="$v.form.email"
    label="Email with wrapper"
  >
    <q-input
      v-model="form.email"
      placeholder="Input Email"
      @input="$v.form.email.$touch()"
    />
  </form-group>
```

### Live Quasar example

<iframe src="https://codesandbox.io/embed/nmzw8rzl?autoresize=1&module=%2Fsrc%2Fcomponents%2FFormSummary.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Usage with Vue Material

Vue Material uses a very simple wrapper around its inputs to give them error state. Just wrap your input with an `md-field` and give it a class of `md-invalid` and you are done.

```vue
<template>
  <md-field :class="{ 'md-invalid': hasErrors }">
    <label> {{label}} </label>
    <slot/>
    <span class="md-error" v-if="hasErrors">{{ firstErrorMessage }}</span>
  </md-field>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";
export default {
  extends: singleErrorExtractorMixin
};
</script>
```
Usage is straight forward

```vue
<form-group :validator="$v.form.email" label="Email Input">
  <md-input 
    v-model="form.email"
    @input="$v.form.email.$touch()"
  />
</form-group>
```

### Live Vue Material Example

<iframe src="https://codesandbox.io/embed/v37lk6zlvl?autoresize=1&module=%2Fsrc%2Fcomponents%2FExampleForm.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Usage with BootstrapVue

Bootstrap Vue offers the `v-form-group` component with `invalid-feedback` and `state` props. It expects an error message and a boolean state, so we pass the `firstErrorMessage` and the `isValid`.

Added bonus is the scoped slot with `attrs` and `listeners` props. You can skip those, but they can reduce boilerplate in the future.

```vue
<template>
  <b-form-group
    :invalid-feedback="firstErrorMessage"
    :state="isValid"
    :label="label"
  >
    <slot
      :attrs="{ state: isValid }"
      :listeners="{ input: () => preferredValidator.$touch() }"
    />
  </b-form-group>
</template>
<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";

export default {
  name: "FormElement",
  extends: singleErrorExtractorMixin
};
</script>
```

Usage is simple

```vue
<form-group :validator="$v.form.email" label="Email with wrapper">
  <template slot-scope="{ attrs, listeners }">
    <b-form-input
      v-bind="attrs"
      v-on="listeners"
      v-model="form.email"
    />
  </template>  
</form-group>
```

### Live Bootstrap Vue Example

<iframe src="https://codesandbox.io/embed/2pww743mrr?autoresize=1&module=%2Fsrc%2Fcomponents%2FExampleForm.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
