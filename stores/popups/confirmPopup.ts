interface State {
  active: boolean
  initialSettings: Settings
  settings: Settings
}
interface Settings {
  title: string
  content: string
  confirm?: Function
  cancel?: Function
  confirmText?: string
  cancelText?: string
}

const initialSettings: Settings = {
  title: 'Подтверждение',
  content: '',
  confirmText: 'Да',
  cancelText: 'Нет',
}

export const useConfirmPopupStore = defineStore('confirmPopup', {
  state: (): State => ({
    active: false,
    initialSettings,
    settings: initialSettings,
  }),
  actions: {
    show(settings: Partial<Settings>) {
      this.resetSettings()
      this.settings = { ...initialSettings, ...settings }

      this.settings.confirm = () => {
        this.hide()
        if (settings.confirm) settings.confirm()
      }
      this.settings.cancel = () => {
        this.hide()
        if (settings.cancel) settings.cancel()
      }

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
