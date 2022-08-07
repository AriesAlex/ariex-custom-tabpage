<template>
  <div id="link-toolbar">
    <div
      class="toolbar"
      :style="`${$full ? 'bottom' : 'top'}: 25px; pointer-events: ${
        link ? 'initial' : 'none'
      };`"
      :class="{ hide: !link }"
    >
      <div class="action" v-for="action in actions" :key="action.id">
        <i :class="'el-icon-' + action.icon" @click="action.func" />
      </div>
    </div>

    <div
      class="background"
      v-if="link"
      @click="close"
      @contextmenu.prevent="close"
      @keydown.esc="close"
    />
  </div>
</template>

<script>
import { arrayMoveMutable } from 'array-move'
export default {
  props: ['link'],
  data() {
    return {
      actions: [
        {
          id: 'left',
          icon: 'arrow-left',
          func: async () => {
            this.move('left')
          },
        },
        {
          id: 'delete',
          icon: 'close danger',
          func: async () => {
            this.$events.emit(
              'show-confirm',
              `Вы уверены, что хотите удалить "${this.link.title}"?`,
              async () => {
                this.close()
                await this.$api.post('api/delete', this.link)
                await this.$store.getLinks()
              }
            )
          },
        },
        {
          id: 'edit',
          icon: 'edit',
          func: async () => {
            this.close()
            this.$events.emit('show-add', this.link)
          },
        },
        {
          id: 'right',
          icon: 'arrow-right',
          func: async () => {
            this.move('right')
          },
        },
      ],
      moveOffset: 0,
      moveTimer: null,
    }
  },
  methods: {
    close() {
      if (this.moveTimer) return
      this.$emit('close')
    },
    move(direction) {
      const directionOffset = direction == 'right' ? +1 : -1
      this.moveOffset += directionOffset
      const index = this.$store.links.findIndex(l => l.id == this.link.id)
      arrayMoveMutable(this.$store.links, index, index + directionOffset)

      if (this.moveTimer) {
        clearInterval(this.moveTimer)
        this.moveTimer = null
      }
      this.moveTimer = setInterval(() => {
        clearInterval(this.moveTimer)
        this.moveTimer = null

        if (!this.moveOffset) return
        this.$api
          .post('api/move', { ...this.link, offset: this.moveOffset })
          .then(() => {
            this.moveOffset = 0
          })
      }, 500)
    },
  },
}
</script>

<style lang="scss">
#link-toolbar {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  > * {
    pointer-events: initial;
  }

  > .toolbar {
    position: absolute;
    background-color: white;
    left: 50%;
    border-radius: 8px;
    box-shadow: 0 1px 11px 1px rgb(0 0 0 / 20%);
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.25s all;

    opacity: 1;
    transform: translateX(-50%) translateY(0);
    &.hide {
      opacity: 0;
      transform: translateX(-50%) translateY(-50px);
    }

    > .action {
      padding: 5px;
      font-size: 24px;
      cursor: pointer;
      transition: 0.2s all;

      &:hover {
        transform: scale(1.3);
      }

      > * {
        color: #909399;
      }
      > .danger {
        color: #f56c6c;
      }
    }
  }

  > .background {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
}
</style>
