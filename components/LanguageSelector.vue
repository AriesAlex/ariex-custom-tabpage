<template>
  <el-select
    class="language-selector"
    v-model="locale"
    suffix-icon=""
    size="small"
  >
    <el-option
      v-for="item in (locales as LocaleObject[])"
      :key="item.code"
      :label="item.name"
      :value="item.code"
    />
    <template v-slot:prefix>🌍</template>
  </el-select>
</template>

<script setup lang="ts">
import { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'
const { locale, locales } = useI18n()
</script>

<style lang="scss">
.language-selector {
  width: min-content;

  .el-input__prefix-inner > :last-child {
    margin-right: 0;
    margin-top: 2px;
  }
}
</style>
