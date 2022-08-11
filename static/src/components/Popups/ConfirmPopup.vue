<template>
  <div id="confirm-popup">
    <PopupBase :title="title" :show="show" @close="cancel">
      <div v-html="content" />

      <div class="buttons">
        <el-button @click="cancel">{{ cancelText }}</el-button>
        <el-button @click="confirm" type="primary">{{ confirmText }}</el-button>
      </div>
    </PopupBase>
  </div>
</template>

<script>
import PopupBase from '@/components/Popups/PopupBase'
export default {
  components: { PopupBase },
  data() {
    return {
      show: false,
      title: '',
      content: '',
      confirm: () => {},
      cancel: () => {},
      confirmText: '',
      cancelText: '',
    }
  },
  created() {
    this.$events.on(
      'show-confirm',
      (content, confirm, cancel, options = {}) => {
        this.title = options.title ?? 'Подтверждение'
        this.content = content
        this.confirm = () => {
          this.show = false
          if (confirm) confirm()
        }
        this.cancel = () => {
          this.show = false
          if (cancel) cancel()
        }
        this.confirmText = options.confirmText ?? 'Да'
        this.cancelText = options.cancelText ?? 'Нет'
        this.show = true
      }
    )
  },
}
</script>

<style lang="scss">
#confirm-popup {
  .buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;

    > *:nth-child(1) {
      margin-right: 5px;
    }
  }
}
</style>
