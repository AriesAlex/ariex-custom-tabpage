<template>
  <component v-if="backgroundComponent" :is="backgroundComponent" />
</template>

<script setup lang="ts">
import Video from '@/components/Backgrounds/Video.vue'
import Image from '@/components/Backgrounds/Image.vue'
import Color from '@/components/Backgrounds/Color.vue'
import { useSettingsStore } from '@/stores/settings'
const isFull = useIsFull()

const settingsStore = useSettingsStore()

const currentBackgroundType = computed(() =>
  isFull.value
    ? settingsStore.settings?.wallpaperType
    : settingsStore.settings?.mobileWallpaperType
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
