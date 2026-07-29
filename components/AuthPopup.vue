<template>
  <div id="auth-popup" @keydown.enter="submit">
    <PopupBase :title="$t('account')" :show="true" :closable="false">
      <el-tabs v-model="mode" stretch>
        <el-tab-pane :label="$t('login')" name="login" />
        <el-tab-pane
          v-if="authStore.auth.registrationEnabled"
          :label="$t('register')"
          name="register"
        />
      </el-tabs>

      <ElInput
        v-model="username"
        :placeholder="$t('username')"
        autocomplete="username"
        autofocus
      />
      <ElInput
        v-model="password"
        :placeholder="$t('password')"
        type="password"
        :autocomplete="
          mode === 'login' ? 'current-password' : 'new-password'
        "
        show-password
      />
      <ElAlert v-if="error" :title="error" type="error" :closable="false" />
      <ElButton type="primary" :loading="loading" @click="submit">
        {{ mode === 'login' ? $t('login') : $t('createAccount') }}
      </ElButton>
    </PopupBase>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { getRequestErrorMessage } from '~/utils/requestError'

const { t } = useI18n()
const authStore = useAuthStore()
const mode = ref<'login' | 'register'>('login')
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

watch(mode, () => (error.value = ''))

async function submit() {
  if (loading.value) return
  loading.value = true
  error.value = ''

  try {
    const credentials = { username: username.value, password: password.value }
    if (mode.value === 'login') await authStore.login(credentials)
    else await authStore.register(credentials)
    password.value = ''
  } catch (requestError) {
    error.value = getRequestErrorMessage(requestError, t('unexpectedError'))
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
#auth-popup {
  .popup {
    width: min(360px, 90vw);
  }

  .popup-content {
    gap: 12px;
  }
}
</style>
