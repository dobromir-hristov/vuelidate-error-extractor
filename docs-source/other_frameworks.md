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
  <el-form-item v-bind="$attrs" :error='firstErrorMessage'>
    <slot/>
  </el-form-item>
</template>
<script>
  import { singleErrorExtractorMixin } from 'vuelidate-error-extractor'
  export default {
    name: 'el-form-item-extended', // or what ever you want
    extends: singleErrorExtractorMixin,
    inheritAttrs: false
  }
</script>
```

You can be more specific with the props that get assigned, but for simplicity this will do.

```vue
<el-form label-width="120px" size="mini">
  <el-form-item-extended label="Activity name" :validator="$v.sizeForm.name">
    <el-input v-model="sizeForm.name"></el-input>
  </el-form-item-extended>
</el-form>
```

## Usage with iView

iView uses the same mechanics and props as ElementUI.
Adapt the above example for it by using `Form` and `FormItem` components.

## Usage with Framework7

This one is easier. We just need a simple invisible wrapper.

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
