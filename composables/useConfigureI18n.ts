export default async () => {
  const { getBrowserLocale, setLocale, locale } = useI18n()

  const savedLang = useCookie('lang')

  watch(locale, newLocale => {
    if (savedLang.value != newLocale) savedLang.value = newLocale
  })

  await setLocale(savedLang.value || getBrowserLocale() || 'en')
}
