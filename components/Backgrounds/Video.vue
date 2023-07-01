<template>
  <video
    :src="currentBackgroundSrc"
    class="video-background"
    autoplay
    muted
    loop
  />
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
const settingsStore = useSettingsStore()
const isFull = useIsFull()

const currentBackgroundSrc = computed(() =>
  isFull.value
    ? settingsStore.settings.wallpaperSrc
    : settingsStore.settings.mobileWallpaperSrc
)
</script>

<style lang="scss" scoped>
.video-background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  object-position: top;
  z-index: -1;
}
</style>
