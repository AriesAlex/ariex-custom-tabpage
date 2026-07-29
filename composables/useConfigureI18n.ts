import { isLocaleCode } from '~/locales'
import type { LocaleCode } from '~/locales'

export default async () => {
  const { getBrowserLocale, setLocale, locale } = useI18n()

  const savedLang = useCookie<LocaleCode | null>('lang')

  watch(locale, (newLocale: LocaleCode) => {
    if (savedLang.value != newLocale) savedLang.value = newLocale
  })

  const browserLocale = getBrowserLocale()
  const selectedLocale =
    savedLang.value || (isLocaleCode(browserLocale) ? browserLocale : 'en')
  await setLocale(selectedLocale)
  savedLang.value = selectedLocale
}
