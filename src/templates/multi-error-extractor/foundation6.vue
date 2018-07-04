<template>
  <base-multi-error-extractor :validator="validator" :attributes="attributes" style="margin-top: 1rem">
    <template slot-scope="{ errorMessage }">
      <label class="form-error is-visible">{{ errorMessage }}</label>
    </template>
  </base-multi-error-extractor>
</template>

<script>
import baseMultiErrorExtractor from './baseMultiErrorExtractor.vue'

export default {
  components: {
    baseMultiErrorExtractor
  },
  props: {
    validator: {
      type: Object,
      required: true
    },
    attributes: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
