import type Link from '@/interfaces/Link'

interface State {
  links: Link[]
}

export const useLinksStore = defineStore('links', {
  state: (): State => ({
    links: [],
  }),
  actions: {
    async loadLinks() {
      if (process.server) {
        const { data, error } = await useFetch<Link[]>('/api/links/get')
        if (error.value) throw error.value
        this.links = data.value ?? []
      } else this.links = await $fetch<Link[]>('/api/links/get')
    },
  },
})
