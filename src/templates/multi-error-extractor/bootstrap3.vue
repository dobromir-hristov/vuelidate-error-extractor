<template>
  <base-multi-error-extractor v-bind="$attrs" class="has-error">
    <template slot-scope="{ errorMessage }">
      <label class="help-block">{{ errorMessage }}</label>
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
