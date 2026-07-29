import type Settings from '@/interfaces/Settings'
import getDefaultSettings from '~/shared/DefaultSettings'

interface State {
  settings: Settings
}

export const useSettingsStore = defineStore('settings', {
  state: (): State => ({
    settings: getDefaultSettings(),
  }),
  actions: {
    async loadSettings() {
      if (process.server) {
        const { data, error } = await useFetch<Settings>('/api/settings/get')
        if (error.value) throw error.value
        if (!data.value) throw new Error('Settings endpoint returned no data')
        this.settings = data.value
      } else this.settings = await $fetch<Settings>('/api/settings/get')
    },
    async applySettings() {
      await $fetch('/api/settings/patch', { method: 'POST', body: this.settings })
    },
    resetSettings() {
      this.settings = getDefaultSettings()
    },
  },
})
