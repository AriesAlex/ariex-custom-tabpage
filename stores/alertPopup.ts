interface State {
  active: boolean
  initialSettings: Settings
  settings: Settings
}
interface Settings {
  title: string
  content: string
}

const initialSettings: Settings = {
  title: 'Внимание',
  content: '',
}

export const useAlertPopupStore = defineStore('alertPopup', {
  state: (): State => ({
    active: false,
    initialSettings,
    settings: initialSettings,
  }),
  actions: {
    show(settings: Settings) {
      this.resetSettings()
      this.settings = { ...initialSettings, ...settings }
      this.active = true
    },
    hide() {
      this.active = false
    },
    resetSettings() {
      this.settings = initialSettings
    },
  },
})
