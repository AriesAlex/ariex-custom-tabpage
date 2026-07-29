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
          <AccountMenu v-if="auth.multiUserEnabled" />
          <ElButton type="danger" text @click="resetSettings">{{
            isFull ? $t('resetSettings') : $t('reset')
          }}</ElButton>
        </div>
        <div class="right">
          <ElButton type="primary" :loading="applying" @click="applySettings">{{
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
import { useAuthStore } from '~/stores/auth'
import { useAlertPopupStore } from '~/stores/popups/alertPopup'
import { getRequestErrorMessage } from '~/utils/requestError'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const alertPopupStore = useAlertPopupStore()
const settingsPopupStore = useSettingsPopupStore()
const { active } = storeToRefs(settingsPopupStore)
const { auth } = storeToRefs(authStore)

const isFull = useIsFull()
const applying = ref(false)

async function applySettings() {
  if (applying.value) return
  applying.value = true
  try {
    await settingsStore.applySettings()
    settingsPopupStore.hide()
  } catch (error) {
    showError(error)
  } finally {
    applying.value = false
  }
}

function resetSettings() {
  settingsStore.resetSettings()
}

async function close() {
  settingsPopupStore.hide()
  try {
    await settingsStore.loadSettings()
  } catch (error) {
    showError(error)
  }
}

function showError(error: unknown) {
  alertPopupStore.show(
    { content: getRequestErrorMessage(error, t('unexpectedError')) },
    t
  )
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
