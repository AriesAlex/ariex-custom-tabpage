<template>
  <component
    v-if="backgroundComponent"
    :is="backgroundComponent"
    class="background"
    :class="{ darkening: settings.wallpaperDarkening }"
  />
</template>

<script setup lang="ts">
import Video from '@/components/Backgrounds/Video.vue'
import Image from '@/components/Backgrounds/Image.vue'
import Color from '@/components/Backgrounds/Color.vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import type { WallpaperType } from '~/interfaces/Settings'
const isFull = useIsFull()

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const currentBackgroundType = computed<WallpaperType>(() =>
  isFull.value
    ? settings.value?.wallpaperType
    : settings.value?.mobileWallpaperType
)

const backgroundComponent = computed(() => {
  if (currentBackgroundType.value === 'video') return Video
  if (currentBackgroundType.value === 'image') return Image
  return Color
})
</script>

<style lang="scss" scoped>
.background {
  transition: 0.5s filter;
  &.darkening {
    filter: brightness(0.8);
  }
}
</style>
