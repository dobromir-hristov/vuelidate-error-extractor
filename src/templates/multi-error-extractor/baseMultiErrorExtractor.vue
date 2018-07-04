<template>
  <div>
    <div v-for="(error, index) in activeErrorMessages" :key="index">
      <slot
        :error-message="error"
        :error="activeErrors[index]">
        <div>{{ error }}</div>
      </slot>
    </div>
  </div>
</template>

<script>
import multiErrorExtractorMixin from '../../multi-error-extractor-mixin'

export default {
  name: 'baseMultiErrorExtractor',
  extends: multiErrorExtractorMixin
}
</script>
