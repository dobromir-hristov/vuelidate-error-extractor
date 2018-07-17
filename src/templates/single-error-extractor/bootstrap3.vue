<template>
  <div
    class="form-group"
    :class="{'has-error': hasErrors, 'has-success':isValid }">
    <slot name="label">
      <label
        class="control-label"
        v-if="label">
        {{ label }} {{ errors ? '*' : '' }}
      </label>
    </slot>
    <slot
      :attributes="attributes"
      :errors="activeErrors"
      :events="events"
      :first-error-message="firstErrorMessage"
      :has-errors="hasErrors"
      :validator="preferredValidator"
    />
    <slot
      name="errors"
      :errors="activeErrors"
      :error-messages="activeErrorMessages"
      :has-errors="hasErrors"
      :first-error-message="firstErrorMessage">
      <div class="help-block" v-if="hasErrors">
        <span
          v-if="showSingleError"
          :data-validation-attr="firstError.validationKey">
          {{ firstErrorMessage }}
        </span>
        <template v-if="!showSingleError">
          <span
            v-for="error in activeErrors"
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
import singleErrorExtractorMixin from '../../single-error-extractor-mixin'

export default {
  mixins: [singleErrorExtractorMixin],
  computed: {
    attributes () {
      return {
        class: { 'form-control': true },
        name: this.name || undefined
      }
    }
  }
}
</script>
