<template>
  <base-multi-error-extractor :validator="validator" :attributes="attributes" class="has-error">
    <template slot-scope="{ errorMessage }">
      <label class="help-block">{{ errorMessage }}</label>
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
