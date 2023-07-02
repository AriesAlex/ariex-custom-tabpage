<template>
  <div class="picker">
    <el-color-picker
      :modelValue="modelValue"
      @update:modelValue="newValue => $emit('update:modelValue', newValue)"
      @active-change="color => $emit('update:modelValue', color)"
      :show-alpha="true"
      size="large"
    />
    <div>{{ title }}</div>
  </div>
  <el-input
    :modelValue="modelValue"
    @update:modelValue="newValue => $emit('update:modelValue', newValue)"
    placeholder="Или введите вручную"
  />
  <div class="hint" v-if="showHint">
    Поддерживаются css-свойства. Например
    <a target="_blank" href="https://cssgradient.io">linear-gradient</a> и
    <a target="_blank" href="https://developer.mozilla.org/ru/docs/Web/CSS/url"
      >url</a
    >
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | undefined
    title: string
    showHint?: boolean
  }>(),
  { showHint: true }
)
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.picker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.hint {
  margin-top: 5px;
  margin-left: 5px;
  max-width: 220px;
  font-size: 13px;
  opacity: 0.8;
}
</style>
