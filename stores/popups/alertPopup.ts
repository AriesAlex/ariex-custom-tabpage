interface State {
  active: boolean
  initialSettings: Settings
  settings: Settings
}
interface Settings {
  title?: string
  content: string
}

const initialSettings: Settings = {
  content: '',
  title: '',
}

export const useAlertPopupStore = defineStore('alertPopup', {
  state: (): State => ({
    active: false,
    initialSettings,
    settings: initialSettings,
  }),
  actions: {
    show(settings: Settings) {
      const { t } = useI18n()

      this.resetSettings()
      this.settings = { ...initialSettings, title: t('attention'), ...settings }
      this.active = true
    },
    hide() {
      this.active = false
    },
    resetSettings() {
      this.settings = structuredClone(initialSettings)
    },
  },
})
