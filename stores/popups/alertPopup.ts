interface State {
  active: boolean
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
    settings: structuredClone(initialSettings),
  }),
  actions: {
    show(settings: Settings, t: (key: string) => string) {
      this.settings = { ...initialSettings, title: t('attention'), ...settings }
      this.active = true
    },
    hide() {
      this.active = false
    },
  },
})
