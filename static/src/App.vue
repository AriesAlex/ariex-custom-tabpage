<template>
  <div
    id="app"
    :class="{ mobile: !$full }"
    @touchstart="resetDragPos"
    @touchmove="dragOffset"
  >
    <AddPopup />
    <ConfirmPopup />
    <AlertPopup />
    <video
      :src="$full ? '/video.mp4' : '/video_mini.mp4'"
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

<script>
import LinksGrid from '@/components/LinksGrid'
import AddPopup from '@/components/Popups/AddPopup'
import ConfirmPopup from '@/components/Popups/ConfirmPopup'
import AlertPopup from '@/components/Popups/AlertPopup'

const MIN_GRID_HEIGHT = 140

export default {
  components: { AddPopup, LinksGrid, ConfirmPopup, AlertPopup },
  data() {
    return {
      offset: 0,
      initialOffset: 0,
      lastDragPos: 0,
    }
  },
  methods: {
    openPopup() {
      this.$events.emit('show-add')
    },
    resetOffset() {
      const initial =
        -this.$refs.grid.$refs.root.getBoundingClientRect().height +
        MIN_GRID_HEIGHT
      this.offset = this.initialOffset = initial
    },
    resetDragPos({ touches }) {
      this.lastDragPos = touches[0].clientY
    },
    dragOffset({ touches }) {
      const pos = touches[0].clientY
      const offset = this.lastDragPos - pos
      this.lastDragPos = pos

      this.offset += offset
      if (this.offset < this.initialOffset) this.offset = this.initialOffset
      if (this.offset > 0) this.offset = 0
    },
    _resize() {
      this.resetOffset()
    },
  },
}
</script>

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
}

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

  &.mobile {
    > .grid {
      height: initial;
      position: fixed;
      left: 0;
      right: 0;
    }
  }
}

input {
  -webkit-user-select: text !important;
  user-select: text !important;
}
</style>
