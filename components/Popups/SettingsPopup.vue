<template>
  <div id="settings-popup">
    <PopupBase :title="$t('settings')" :show="active" @close="close">
      <el-tabs :tab-position="isFull ? 'left' : 'top'">
        <SettingsBackgroundTab />
        <SettingsDockPanelTab />
        <SettingsPageTab />
      </el-tabs>

      <div class="options">
        <div class="left">
          <LanguageSelector />
          <ElButton type="danger" text @click="resetSettings">{{
            isFull ? $t('resetSettings') : $t('reset')
          }}</ElButton>
        </div>
        <div class="right">
          <ElButton type="primary" @click="applySettings">{{
            $t('apply')
          }}</ElButton>
        </div>
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

    > * {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
}
</style>
