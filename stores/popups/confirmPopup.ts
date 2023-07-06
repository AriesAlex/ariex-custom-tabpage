import { ComposerTranslation } from '@nuxtjs/i18n/dist/runtime/composables'

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
  content: '',
  title: '',
  confirmText: '',
  cancelText: '',
}

export const useConfirmPopupStore = defineStore('confirmPopup', {
  state: (): State => ({
    active: false,
    initialSettings,
    settings: initialSettings,
  }),
  actions: {
    show(settings: Partial<Settings>, t: ComposerTranslation) {
      this.resetSettings()
      this.settings = {
        ...initialSettings,

        title: t('confirm'),
        confirmText: t('yes'),
        cancelText: t('no'),

        ...settings,
      }

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
      this.settings = structuredClone(initialSettings)
    },
  },
})
