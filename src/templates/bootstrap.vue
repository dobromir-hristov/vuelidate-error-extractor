<template>
  <div class="form-group"
       :class="{'has-error': validator.$error, 'has-success':(!validator.$error && validator.$dirty)}">
    <slot name="label">
      <label v-if="label">{{ label }} {{ errors ? '*' : '' }}</label>
    </slot>
    <slot></slot>
    <slot name="errors">
      <div class="help-block" v-if="validator.$error">
        <template v-for="error in activeErrors">
          <span> {{ getErrorMessage(error.validationKey, error.params) }} </span>
        </template>
      </div>
    </slot>
  </div>
</template>
<script>
  import messageExtractorMixin from '../message-extractor-mixin'

  export default {
    mixins: [messageExtractorMixin]
  }
</script>
