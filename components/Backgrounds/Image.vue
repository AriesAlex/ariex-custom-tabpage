<template>
  <div class="image-background" :style="{backgroundImage: `url(${currentBackgroundSrc})`}" />
</template>

<script setup lang="ts">
import { useSettingsStore } from '../../stores/settings'
const settingsStore = useSettingsStore()
const isFull = useIsFull()

const currentBackgroundSrc = computed(() =>
  isFull.value
    ? settingsStore.settings?.wallpaperSrc
    : settingsStore.settings?.mobileWallpaperSrc
)
</script>

<style lang="scss" scoped>
.image-background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  object-position: top;
  z-index: -1;
  background-size: cover;
  background-position: center;
}
</style>
