interface State {
  active: boolean
}

export const useSettingsPopupStore = defineStore('settingsPopup', {
  state: (): State => ({
    active: false,
  }),
  actions: {
    show() {
      this.active = true
    },
    hide() {
      this.active = false
    },
  },
})
