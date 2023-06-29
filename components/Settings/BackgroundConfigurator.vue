<template>
  <el-select v-model="wallpaperType" placeholder="Тип фона">
    <el-option label="Видео" value="video" />
    <el-option label="Картинка" value="image" />
    <el-option label="Цвет" value="color" />
  </el-select>

  <div v-if="wallpaperType == 'video'"></div>
  <div v-if="wallpaperType == 'image'"></div>
  <div v-if="wallpaperType == 'color'" class="color-settings">
    <div class="picker">
      <el-color-picker v-model="wallpaperSrc" size="large" />
      <div>Выберите цвет</div>
    </div>
    <el-input v-model="wallpaperSrc" placeholder="Или введите вручную" />
    <div class="hint">
      Поддерживаются css-свойства. Например
      <a target="_blank" href="https://cssgradient.io">linear-gradient</a> и url
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '~/stores/settings'

const props = defineProps<{ mobile: boolean }>()
const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const wallpaperType = computed({
  get() {
    return props.mobile
      ? settings.value?.mobileWallpaperType
      : settings.value?.wallpaperType
  },
  set(value) {
    props.mobile
      ? (settings.value!.mobileWallpaperType = value ?? 'video')
      : (settings.value!.wallpaperType = value ?? 'video')
  },
})

const wallpaperSrc = computed({
  get() {
    return props.mobile
      ? settings.value?.mobileWallpaperSrc
      : settings.value?.wallpaperSrc
  },
  set(value) {
    props.mobile
      ? (settings.value!.mobileWallpaperSrc = value ?? '')
      : (settings.value!.wallpaperSrc = value ?? '')
  },
})
</script>

<style lang="scss" scoped>
.color-settings {
  margin-top: 25px;
  > .picker {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
  }

  > .hint {
    margin-top: 5px;
    margin-left: 5px;
    max-width: 220px;
    font-size: 13px;
    opacity: 0.8;
  }
}
</style>
