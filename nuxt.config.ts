import locales from './locales'

export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@pinia/nuxt', '@nuxtjs/i18n'],
  components: ['~/components', '~/components/Popups'],
  nitro: {
    esbuild: {
      options: {
        target: 'es2022',
      },
    },
  },
  i18n: {
    restructureDir: '.',
    langDir: 'locales',
    locales,
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    strategy: 'no_prefix',
  },
})
