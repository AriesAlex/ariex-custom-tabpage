import { createI18n } from 'vue-i18n'
import locales from '../../locales'
import { isLocaleCode } from '../../locales'
import en from '../../locales/en.json'
import ru from '../../locales/ru.json'

const messages = { en, ru }

const i18n = createI18n({
  fallbackLocale: 'en',
}).global

for (const locale of locales) {
  i18n.setLocaleMessage(locale.code, messages[locale.code])
}

export default defineEventHandler(e => {
  const savedLocale = getCookie(e, 'lang')
  const locale = isLocaleCode(savedLocale) ? savedLocale : 'en'
  e.context.$t = (key: string) => i18n.t(key, {}, { locale })
})

declare module 'h3' {
  interface H3EventContext {
    $t: typeof i18n.t
  }
}
