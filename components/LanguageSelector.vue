<template>
  <el-select
    class="language-selector"
    v-model="locale"
    suffix-icon=""
    size="small"
  >
    <el-option
      v-for="locale in locales"
      :key="locale.code"
      :label="locale.name"
      :value="locale.code"
    />
    <template v-slot:prefix>🌍</template>
  </el-select>
</template>

<script setup lang="ts">
import locales from '@/locales'
const { locale } = useI18n()
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
