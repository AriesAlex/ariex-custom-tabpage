export default () => {
  const { getBrowserLocale, setLocale, locale } = useI18n()

  const savedLang = useCookie('lang')

  watch(locale, newLocale => {
    if (savedLang.value != newLocale) savedLang.value = newLocale
  })

  setLocale(savedLang.value || getBrowserLocale() || 'en')
}
