<template>
  <div class="color-background" :style="{ background: currentBackgroundSrc }" />
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
const settingsStore = useSettingsStore()
const isFull = useIsFull()

const currentBackgroundSrc = computed(() =>
  isFull.value
    ? settingsStore.settings?.wallpaperSrc
    : settingsStore.settings?.mobileWallpaperSrc
)
</script>

<style lang="scss" scoped>
.color-background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  object-position: top;
  z-index: -1;
}
</style>
