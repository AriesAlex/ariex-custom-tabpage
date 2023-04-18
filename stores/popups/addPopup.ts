export const DEFAULT_ICON = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAaBJREFUWEftlksuRUEQhr87YAeIR6yAFTDBiLEpQwMb8BgIMWAFxJRFMDHDCgzMxXMJEiG/dEurdN86N1e7kdwzOjmnT/1f/VV9ulr0+Gr1WJ8+QOrAILAPrACjlUrzCJwBO8CbNFKAQ2CjkrANK60tC/AAjAEzwE0lEMW+AuTEuAX4CKK1G/OHTir22wBLwElIag04D/d/BnAPTARR3U/+e4DhkMFrwwZdNCW46MaBIeASGADmgaeGELllHfeAMpf4VIh2CywAJSc8pzoCSMUlrEsgJYi4XutKkI0Bou3TwB0wB7wHN+KztBzpegHom1y5GgHYzNNscu8kGMvkOeUCjJhgOSu90ligNIYLoAza1Tl2ttecJRddgFg/1fzZ2W62T2zNc+91EH2fQ7mzwNtmlinNdB04NgusE3E7f2nnANQDTf92aTmWgaOCY7ZcbR2odRzbbVp0oBaAspYTL14P1ASQdnEXxJFsFrju4rBp92kcyaT1NSuk2R4Am5WEbVhpbVsAjeV7wGoYTmuwKPNTYDc3ltcQdGPWbrg+gOvAJ17NfyGYRfQdAAAAAElFTkSuQmCC`
import Link from './../../interfaces/Link'
interface State {
  active: boolean
  initialSettings: Settings
  settings: Settings
}
interface Settings {
  link: Link
  getIconTimer: NodeJS.Timer | null
  customIconApplied: boolean
}

const initialSettings: Settings = {
  link: {
    id: null,
    title: '',
    url: '',
    icon: DEFAULT_ICON,
  },
  getIconTimer: null,
  customIconApplied: false,
}

export const useAddPopupStore = defineStore('addPopup', {
  state: (): State => ({
    active: false,
    initialSettings,
    settings: initialSettings,
  }),
  actions: {
    show(link?: Link) {
      this.resetSettings()
      if (link != null) this.settings.link = link
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
