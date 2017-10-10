<template>
  <div class="form-group"
       :class="{error: hasErrors}">
    <slot name="label">
      <label :class="{'is-invalid-label': hasErrors}"
             v-if="label">{{ label }} {{ errors ? '*' : '' }}</label>
    </slot>
    <slot :errors="activeErrors"
          :has-errors="hasErrors"
          :first-error-message="firstErrorMessage"
    ></slot>
    <slot name="errors"
          :errors="activeErrors"
          :has-errors="hasErrors"
          :first-error-message="firstErrorMessage">
      <div class="form-error is-visible" v-if="hasErrors">
        <span v-if="showSingleError"
              :data-validation-attr="firstError.validationKey">
          {{ firstErrorMessage }}
        </span>
        <template v-if="!showSingleError">
          <span v-for="error in activeErrors"
                :key="error.validationKey"
                :data-validation-attr="error.validationKey">
            {{ getErrorMessage(error.validationKey, error.params) }}
          </span>
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
