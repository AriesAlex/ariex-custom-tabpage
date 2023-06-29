import Link from '@/interfaces/Link'

interface State {
  links: Link[]
}

export const useLinksStore = defineStore('links', {
  state: (): State => ({
    links: [],
  }),
  actions: {
    async loadLinks() {
      if (process.server)
        this.links = (await useFetch<Link[]>('/api/links/get')).data.value || []
      else this.links = (await $fetch<Link[]>('/api/links/get')) || []
    },
  },
})
