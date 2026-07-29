export type LocaleCode = 'en' | 'ru'

const locales: { code: LocaleCode; name: string; file: string }[] = [
  {
    code: 'en',
    name: 'English',
    file: 'en.json',
  },
  {
    code: 'ru',
    name: 'Русский',
    file: 'ru.json',
  },
]

export default locales
