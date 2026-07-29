<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <ElButton class="account-button" text>
      <ElIcon><User /></ElIcon>
      <span>{{ auth.user?.username }}</span>
      <ElIcon><ArrowDown /></ElIcon>
    </ElButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="logout">
          {{ $t('logout') }}
        </el-dropdown-item>
        <el-dropdown-item command="delete" divided>
          <span class="danger">{{ $t('deleteAccount') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ArrowDown, User } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useAlertPopupStore } from '~/stores/popups/alertPopup'
import { useAuthStore } from '~/stores/auth'
import { useConfirmPopupStore } from '~/stores/popups/confirmPopup'
import { useSettingsPopupStore } from '~/stores/popups/settingsPopup'
import { getRequestErrorMessage } from '~/utils/requestError'

const { t } = useI18n()
const authStore = useAuthStore()
const { auth } = storeToRefs(authStore)
const alertPopupStore = useAlertPopupStore()
const confirmPopupStore = useConfirmPopupStore()
const settingsPopupStore = useSettingsPopupStore()

function handleCommand(command: 'logout' | 'delete') {
  if (command === 'logout') {
    perform(() => authStore.logout())
    return
  }

  confirmPopupStore.show(
    {
      content: t('deleteAccountConfirm'),
      confirmText: t('delete'),
      confirm: () => perform(() => authStore.deleteAccount()),
    },
    t
  )
}

async function perform(action: () => Promise<void>) {
  try {
    await action()
    settingsPopupStore.hide()
  } catch (error) {
    alertPopupStore.show(
      { content: getRequestErrorMessage(error, t('unexpectedError')) },
      t
    )
  }
}
</script>

<style lang="scss" scoped>
.account-button {
  padding: 0 8px;
  gap: 4px;
}

.danger {
  color: var(--el-color-danger);
}
</style>
