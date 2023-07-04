// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Новая вкладка',
    },
  },
  modules: ['@element-plus/nuxt', '@pinia/nuxt', '@nuxtjs/i18n'],
  components: ['~/components', '~/components/Popups'],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  experimental: {
    inlineSSRStyles: false,
  },
  i18n: {
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'ru',
        name: 'Русский',
      },
    ].map(lang => ({ ...lang, file: lang.code + '.json' })),
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    strategy: 'no_prefix',
  },
})
