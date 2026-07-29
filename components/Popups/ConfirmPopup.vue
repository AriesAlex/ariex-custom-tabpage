<template>
  <div id="confirm-popup">
    <PopupBase
      :title="settings.title"
      :show="active"
      @close="confirmPopupStore.cancel"
    >
      <div>{{ settings.content }}</div>

      <div class="buttons">
        <ElButton @click="confirmPopupStore.cancel">{{
          settings.cancelText
        }}</ElButton>
        <ElButton @click="confirmPopupStore.confirm" type="primary">{{
          settings.confirmText
        }}</ElButton>
      </div>
    </PopupBase>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConfirmPopupStore } from '~/stores/popups/confirmPopup'

const confirmPopupStore = useConfirmPopupStore()
const { active, settings } = storeToRefs(confirmPopupStore)
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
