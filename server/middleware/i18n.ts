import { createI18n } from 'vue-i18n'
import locales from '../../locales'
import fs from 'fs-extra'

const i18n = createI18n({
  fallbackLocale: 'en',
}).global

for (const locale of locales) {
  i18n.setLocaleMessage(locale.code, fs.readJSONSync('locales/' + locale.file))
}

export default defineEventHandler(e => {
  e.context.$t = (key: string) =>
    i18n.t(key, getCookie(e, 'lang') || i18n.fallbackLocale.toString())
})

declare module 'h3' {
  interface H3EventContext {
    $t: typeof i18n.t
  }
}
