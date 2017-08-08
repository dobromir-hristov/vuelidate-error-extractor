<template>
  <div class="form-group" :class="{error: validator.$error}">
    <slot name="label">
      <label :class="{'is-invalid-label': validator.$error}" v-if="label">{{ label }} {{ errors ? '*' : '' }}</label>
    </slot>
    <slot></slot>
    <slot name="errors">
      <div class="form-error is-visible" v-if="validator.$error">
        <div class="form-error__element" v-for="error in errors">
          <span :data-validation-attr="error.validationKey" class="form-error__text" v-if="!error.errorStatus"> {{ $t('validation.' + error.validationKey, error.params) }} </span>
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
