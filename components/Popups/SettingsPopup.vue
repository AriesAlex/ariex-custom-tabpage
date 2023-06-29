<template>
  <div id="settings-popup">
    <PopupBase title="Настройки" :show="active" @close="close">
      <el-tabs :tab-position="isFull ? 'left' : 'top'">
        <SettingsBackground />
      </el-tabs>

      <div class="apply-btn-wrapper">
        <ElButton type="primary" @click="apply">Применить</ElButton>
      </div>
    </PopupBase>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsPopupStore } from '~/stores/popups/settingsPopup'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()
const settingsPopupStore = useSettingsPopupStore()
const { active } = storeToRefs(settingsPopupStore)

const isFull = useIsFull()

async function apply() {
  await settingsStore.applySettings()
  close()
}

function close() {
  settingsPopupStore.hide()
  settingsStore.loadSettings()
}
</script>

<style lang="scss">
#settings-popup .popup-content {
  >.el-tabs {
    overflow: initial;
  }
  > .apply-btn-wrapper {
    margin-top: 25px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
