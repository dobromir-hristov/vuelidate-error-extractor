<template>
  <div class="form-group"
       :class="{error: validator.$error}">
    <slot name="label">
      <label :class="{'is-invalid-label': validator.$error}"
             v-if="label">{{ label }} {{ errors ? '*' : '' }}</label>
    </slot>
    <slot></slot>
    <slot name="errors">
      <div class="form-error is-visible" v-if="validator.$error">
        <template v-for="error in activeErrors">
          <span :data-validation-attr="error.validationKey">{{ getErrorMessage(error.validationKey, error.params) }} </span>
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
