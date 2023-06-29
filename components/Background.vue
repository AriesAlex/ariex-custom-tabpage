<template>
  <component
    v-if="backgroundComponent"
    :is="backgroundComponent"
    class="background"
    :class="{ darkening: settings?.wallpaperDarkening }"
  />
</template>

<script setup lang="ts">
import Video from '@/components/Backgrounds/Video.vue'
import Image from '@/components/Backgrounds/Image.vue'
import Color from '@/components/Backgrounds/Color.vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
const isFull = useIsFull()

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const currentBackgroundType = computed(() =>
  isFull.value
    ? settings.value?.wallpaperType
    : settings.value?.mobileWallpaperType
)

const backgroundComponent = computed(() =>
  currentBackgroundType.value
    ? {
        video: Video,
        image: Image,
        color: Color,
      }[currentBackgroundType.value]
    : null
)
</script>

<style lang="scss" scoped>
.background {
  &.darkening {
    filter: brightness(0.8);
  }
}
</style>
