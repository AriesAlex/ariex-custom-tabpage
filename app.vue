<template>
  <div
    id="app"
    @touchstart="resetDragPos"
    @touchmove="dragOffset"
    v-if="settingsStore.settings"
  >
    <AddPopup />
    <ConfirmPopup />
    <AlertPopup />
    <video
      :src="
        isFull
          ? settingsStore.settings.wallpaperSrc
          : settingsStore.settings.mobileWallpaperSrc
      "
      class="background"
      autoplay
      muted
      loop
    />
    <div class="grid" :style="{ bottom: offset + 'px' }">
      <LinksGrid ref="grid" @add="openPopup" @recalculate="resetOffset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LinksGrid from '@/components/LinksGrid.vue'
import { useLinksStore } from '@/stores/links'
import { useSettingsStore } from '@/stores/settings'
import { watchDebounced } from '@vueuse/shared'
import { useAddPopupStore } from '~/stores/popups/addPopup'
const isFull = useIsFull()

const MIN_GRID_HEIGHT = 140

const offset = ref(0)
const initialOffset = ref(0)
const lastDragPos = ref(0)

const addPopupStore = useAddPopupStore()

const linkStore = useLinksStore()
linkStore.loadLinks()

const settingsStore = useSettingsStore()
settingsStore.loadSettings()

const grid = ref<InstanceType<typeof LinksGrid> | null>(null)

function resetOffset() {
  let gridHeight = 0
  if (grid.value) gridHeight = grid.value.$el.getBoundingClientRect().height

  const initial = -gridHeight + MIN_GRID_HEIGHT

  if (initialOffset.value != initial)
    offset.value = initialOffset.value = initial
}
resetOffset()

function resetDragPos({ touches }: TouchEvent) {
  lastDragPos.value = touches[0].clientY
}

function dragOffset({ touches }: TouchEvent) {
  const pos = touches[0].clientY
  const newOffset = lastDragPos.value - pos
  lastDragPos.value = pos

  offset.value += newOffset
  if (offset.value < initialOffset.value) offset.value = initialOffset.value
  if (offset.value > 0) offset.value = 0
}

watchDebounced(
  initialOffset,
  () => {
    if (process.server) return
    useCookie('lastInitialOffset', {
      maxAge: Number.MAX_SAFE_INTEGER,
    }).value = String(initialOffset.value)
  },
  { debounce: 500, maxWait: 1000 }
)

if (useCookie('lastInitialOffset').value)
  offset.value = initialOffset.value = Number(
    useCookie('lastInitialOffset').value
  )

function openPopup() {
  addPopupStore.show()
}
</script>

<style lang="scss" scoped>
#app {
  > .background {
    filter: brightness(0.8);
    position: fixed;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    object-position: top;
    z-index: -1;
  }

  > .grid {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  @media (max-width: 800px) {
    > .grid {
      height: initial;
      position: fixed;
      left: 0;
      right: 0;
    }
  }
}
</style>

<style lang="scss">
* {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  overscroll-behavior-y: contain;
  margin: 0;
}

input {
  -webkit-user-select: text !important;
  user-select: text !important;
}

.el-input__wrapper {
  padding: 5px 15px;
}
.el-button {
  padding: 20px 15px;
}
</style>
