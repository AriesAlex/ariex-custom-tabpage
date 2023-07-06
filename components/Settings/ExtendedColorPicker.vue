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
  <div class="description" v-if="showHint">{{ description }}</div>
  <el-input
    :modelValue="modelValue"
    @update:modelValue="value => updateValue(value || '')"
    :placeholder="$t('orEnterManually')"
    ref="inputEL"
  />
  <div class="hint" v-if="showHint" v-html="hint" />
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus/es/components/input/index'
const { t } = useI18n()

withDefaults(
  defineProps<{
    modelValue: string | undefined
    title: string
    description?: string
    showHint?: boolean
  }>(),
  { showHint: true }
)
const emit = defineEmits(['update:modelValue'])

const inputEL = ref<InstanceType<typeof ElInput> | null>(null)

const hint = computed(() =>
  t('colorPickerCssPropsHint', [
    `<a
    target="_blank"
    href="https://cssgradient.io"
    >linear-gradient</a
  >`,
    `<a
    target="_blank"
    href="https://developer.mozilla.org/ru/docs/Web/CSS/url"
    >url</a
  >`,
  ])
)

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

.hint,
.description {
  margin-top: 5px;
  margin-left: 5px;
  max-width: 220px;
  font-size: 13px;
  opacity: 0.8;

  &.description {
    margin-bottom: 15px;
  }
}
</style>
