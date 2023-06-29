<template>
  <el-tab-pane v-if="settings" label="Фон" class="background-pane">
    <div class="reversable-pane" :class="{ mobile: !isFull }">
      <el-card shadow="never" header="Десктопная версия">
        <SettingsBackgroundConfigurator :mobile="false" />
      </el-card>
      <el-card shadow="never" header="Мобильная версия">
        <SettingsBackgroundConfigurator :mobile="true" />
      </el-card>
    </div>
    <el-switch
      v-model="settings.wallpaperDarkening"
      active-text="Затемнение фона"
    />
  </el-tab-pane>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const isFull = useIsFull()

watch(
  () => settings.value?.wallpaperType,
  type => {
    switch (type) {
      case 'video': {
        settings.value!.wallpaperSrc = 'video.mp4'
        break
      }
      case 'image': {
        settings.value!.wallpaperSrc = 'image.jpg'
        break
      }
      case 'color': {
        settings.value!.wallpaperSrc = '#222'
        break
      }
    }
  }
)
watch(
  () => settings.value?.mobileWallpaperType,
  type => {
    switch (type) {
      case 'video': {
        settings.value!.mobileWallpaperSrc = 'video_mobile.mp4'
        break
      }
      case 'image': {
        settings.value!.mobileWallpaperSrc = 'image_mobile.jpg'
        break
      }
      case 'color': {
        settings.value!.mobileWallpaperSrc = '#222'
        break
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.background-pane {
  display: flex;
  flex-direction: column;
  gap: 25px;

  > .reversable-pane {
    display: flex;
    flex-direction: column;
    gap: 25px;

    &.mobile {
      flex-direction: column-reverse;
    }
  }
}
</style>
