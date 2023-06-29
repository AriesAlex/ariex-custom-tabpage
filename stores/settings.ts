import Settings from '@/interfaces/Settings'

interface State {
  settings: Settings | null
}

export const useSettingsStore = defineStore('settings', {
  state: (): State => ({
    settings: null,
  }),
  actions: {
    async loadSettings() {
      if (process.server)
        this.settings = (await useFetch<Settings>('/api/settings/get')).data.value
      else this.settings = (await $fetch<Settings>('/api/settings/get'))
    },
  },
})
