import type { AuthState, AuthUser } from '~/interfaces/Auth'
import { useLinksStore } from '~/stores/links'
import { useSettingsStore } from '~/stores/settings'

interface Credentials {
  username: string
  password: string
}

const initialState = (): AuthState => ({
  multiUserEnabled: false,
  registrationEnabled: false,
  user: null,
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth: initialState(),
  }),
  getters: {
    canUseApp: state => !state.auth.multiUserEnabled || state.auth.user != null,
  },
  actions: {
    async loadSession() {
      if (process.server) {
        const { data, error } = await useFetch<AuthState>('/api/auth/session')
        if (error.value) throw error.value
        if (!data.value) throw new Error('Session endpoint returned no data')
        this.auth = data.value
      } else this.auth = await $fetch<AuthState>('/api/auth/session')
    },
    async login(credentials: Credentials) {
      const stores = getUserDataStores()
      const user = await $fetch<AuthUser>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })
      await loadUserData(stores)
      this.auth.user = user
    },
    async register(credentials: Credentials) {
      const stores = getUserDataStores()
      const user = await $fetch<AuthUser>('/api/auth/register', {
        method: 'POST',
        body: credentials,
      })
      await loadUserData(stores)
      this.auth.user = user
    },
    async logout() {
      const stores = getUserDataStores()
      await $fetch('/api/auth/logout', { method: 'POST' })
      resetUserData(stores)
      this.auth.user = null
    },
    async deleteAccount() {
      const stores = getUserDataStores()
      await $fetch('/api/auth/account', { method: 'DELETE' })
      resetUserData(stores)
      this.auth.user = null
    },
  },
})

function getUserDataStores() {
  return {
    links: useLinksStore(),
    settings: useSettingsStore(),
  }
}

function loadUserData(stores: ReturnType<typeof getUserDataStores>) {
  return Promise.all([
    stores.links.loadLinks(),
    stores.settings.loadSettings(),
  ])
}

function resetUserData(stores: ReturnType<typeof getUserDataStores>) {
  stores.links.$reset()
  stores.settings.$reset()
}
