<template>
  <base-multi-error-extractor v-bind="$attrs" style="margin-top: 1rem">
    <template slot-scope="{ errorMessage }">
      <label class="form-error is-visible">{{ errorMessage }}</label>
    </template>
  </base-multi-error-extractor>
</template>

<script>
import baseMultiErrorExtractor from './baseMultiErrorExtractor.vue'

export default {
  inheritAttrs: false,
  components: {
    baseMultiErrorExtractor
  }
}
</script>
