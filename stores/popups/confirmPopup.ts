interface State {
  active: boolean
  settings: Settings
}
interface Settings {
  title: string
  content: string
  confirmText?: string
  cancelText?: string
}

interface PopupOptions extends Partial<Settings> {
  confirm?: () => void
  cancel?: () => void
}

const initialSettings: Settings = {
  content: '',
  title: '',
  confirmText: '',
  cancelText: '',
}

let confirmAction: (() => void) | undefined
let cancelAction: (() => void) | undefined

export const useConfirmPopupStore = defineStore('confirmPopup', {
  state: (): State => ({
    active: false,
    settings: structuredClone(initialSettings),
  }),
  actions: {
    show(options: PopupOptions, t: (key: string) => string) {
      const { confirm, cancel, ...settings } = options
      this.settings = {
        ...initialSettings,

        title: t('confirm'),
        confirmText: t('yes'),
        cancelText: t('no'),

        ...settings,
      }
      confirmAction = confirm
      cancelAction = cancel
      this.active = true
    },
    confirm() {
      const action = confirmAction
      this.hide()
      action?.()
    },
    cancel() {
      const action = cancelAction
      this.hide()
      action?.()
    },
    hide() {
      this.active = false
      confirmAction = undefined
      cancelAction = undefined
    },
  },
})
