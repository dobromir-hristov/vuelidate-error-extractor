<template>
  <div
    class="form-group"
    :class="{error: hasErrors}">
    <slot name="label">
      <label
        :class="{'is-invalid-label': hasErrors}"
        v-if="label">{{ label }} {{ errors ? '*' : '' }}</label>
    </slot>
    <slot
      :attributes="attributes"
      :errorMessages="activeErrorMessages"
      :errors="activeErrors"
      :events="events"
      :first-error-message="firstErrorMessage"
      :has-errors="hasErrors"
      :validator="preferredValidator"
    />
    <slot
      name="errors"
      :errors="activeErrors"
      :errorMessages="activeErrorMessages"
      :has-errors="hasErrors"
      :first-error-message="firstErrorMessage">
      <div
        class="form-error is-visible"
        v-if="hasErrors">
        <span
          v-if="showSingleError"
          :data-validation-attr="firstError.validationKey">
          {{ firstErrorMessage }}
        </span>
        <template v-else>
          <span
            v-for="(error, index) in activeErrorMessages"
            :key="activeErrors[index].validationKey"
            :data-validation-attr="activeErrors[index].validationKey">
            {{ error }}
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
        class: { 'is-invalid-input': this.hasErrors }
      }
    }
  }
}
</script>
