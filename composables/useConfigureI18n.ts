import type { LocaleCode } from '~/locales'

export default async () => {
  const { getBrowserLocale, setLocale, locale } = useI18n()

  const savedLang = useCookie<LocaleCode | null>('lang')

  watch(locale, (newLocale: LocaleCode) => {
    if (savedLang.value != newLocale) savedLang.value = newLocale
  })

  const browserLocale = getBrowserLocale()
  await setLocale(
    savedLang.value || (isLocaleCode(browserLocale) ? browserLocale : 'en')
  )
}

function isLocaleCode(locale: string | null | undefined): locale is LocaleCode {
  return locale === 'en' || locale === 'ru'
}
