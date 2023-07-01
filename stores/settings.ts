import Settings from '@/interfaces/Settings'
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
      if (process.server)
        this.settings = (
          await useFetch<Settings>('/api/settings/get')
        ).data.value ?? getDefaultSettings()
      else this.settings = await $fetch<Settings>('/api/settings/get')
    },
    async applySettings() {
      await $fetch('/api/settings/patch', { method: 'POST', body: this.settings })
    },
    resetSettings() {
      this.settings = getDefaultSettings()
    }
  },
})
