<template>
  <div class="form-group"
       :class="{'has-error': validator.$error, 'has-success':(!validator.$error && !validator.$dirty)}">
    <slot name="label">
      <label v-if="label">{{ label }} {{ errors ? '*' : '' }}</label>
    </slot>
    <slot></slot>
    <slot name="errors">
      <div class="help-block" v-if="validator.$error">
        <div v-for="error in errors">
          <span v-if="!error.errorStatus"> {{ $t('validation.' + error.validationKey, error.params) }} </span>
        </div>
      </div>
    </slot>
  </div>
</template>
<script>
  import messageExtractorMixin from './message-extractor-mixin'

  export default {
    mixins: [messageExtractorMixin]
  }
</script>
