<template>
  <div class="picker">
    <el-color-picker
      :modelValue="modelValue"
      @update:modelValue="value => updateValue(value || '')"
      @active-change="color => $emit('update:modelValue', color)"
      :show-alpha="true"
      size="large"
    />
    <div>{{ title }}</div>
  </div>
  <el-input
    :modelValue="modelValue"
    @update:modelValue="value => updateValue(value || '')"
    placeholder="Или введите вручную"
    ref="inputEL"
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
import { ElInput } from 'element-plus/es/components/input/index'

withDefaults(
  defineProps<{
    modelValue: string | undefined
    title: string
    showHint?: boolean
  }>(),
  { showHint: true }
)
const emit = defineEmits(['update:modelValue'])

const inputEL = ref<InstanceType<typeof ElInput> | null>(null)

function updateValue(value: string) {
  if (value.startsWith('http')) {
    value = `url(${value})`
    setInputCaretPos(value.length - 1)
  }
  if (value.startsWith('to')) {
    value = `linear-gradient(${value})`
    setInputCaretPos(value.length - 1)
  }

  emit('update:modelValue', value)
}

function setInputCaretPos(pos: number) {
    setTimeout(() => {
      inputEL.value?.input?.setSelectionRange(pos, pos)
    }, 10)
}
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
