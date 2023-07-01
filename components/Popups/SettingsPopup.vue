<template>
  <div id="settings-popup">
    <PopupBase title="Настройки" :show="active" @close="close">
      <el-tabs :tab-position="isFull ? 'left' : 'top'">
        <SettingsBackgroundTab />
        <SettingsDockPanelTab />
      </el-tabs>

      <div class="options">
        <ElButton type="danger" text @click="resetSettings">Сбросить настройки</ElButton>
        <ElButton type="primary" @click="applySettings">Применить</ElButton>
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

async function applySettings() {
  await settingsStore.applySettings()
  close()
}

function resetSettings() {
  settingsStore.resetSettings()
}

function close() {
  settingsPopupStore.hide()
  settingsStore.loadSettings()
}
</script>

<style lang="scss">
#settings-popup .popup-content {
  > .el-tabs {
    overflow: initial;
  }
  > .options {
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
