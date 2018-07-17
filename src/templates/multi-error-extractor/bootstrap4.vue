<template>
  <base-multi-error-extractor v-bind="$attrs" class="was-validated">
    <template slot-scope="{ errorMessage }">
      <label class="invalid-feedback d-block">{{ errorMessage }}</label>
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
