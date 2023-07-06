<template>
  <el-tab-pane :label="$t('background')" class="background-pane">
    <el-card shadow="never">
      <SettingsBackgroundConfigurator :mobile="false" />

      <template v-slot:header>
        <el-icon>
          <Platform />
        </el-icon>
        <div>{{ $t('desktopVersion') }}</div>
      </template>
    </el-card>
    <el-card shadow="never">
      <SettingsBackgroundConfigurator :mobile="true" />

      <template v-slot:header>
        <el-icon>
          <Iphone />
        </el-icon>
        <div>{{ $t('mobileVersion') }}</div>
      </template>
    </el-card>
    <el-switch
      v-model="settings.wallpaperDarkening"
      :active-text="$t('wallpaperDarkening')"
    />
  </el-tab-pane>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '~/stores/settings'
import { Iphone, Platform } from '@element-plus/icons-vue'

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

watch(
  () => settings.value?.wallpaperType,
  type => {
    switch (type) {
      case 'video': {
        settings.value!.wallpaperSrc = '/api/static/video'
        break
      }
      case 'image': {
        settings.value!.wallpaperSrc = '/api/static/image'
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
        settings.value!.mobileWallpaperSrc = '/api/static/video_mobile'
        break
      }
      case 'image': {
        settings.value!.mobileWallpaperSrc = '/api/static/image_mobile'
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

<style lang="scss">
.background-pane {
  display: flex;
  flex-direction: column;
  gap: 25px;

  .el-card__header {
    display: flex;
    > .el-icon {
      font-size: 18px;
      margin-right: 5px;
    }
  }
}
</style>
