import Link from '@/interfaces/Link'

interface State {
  links: Link[]
}

export const useLinkStore = defineStore('link', {
  state: (): State => ({
    links: [],
  }),
  actions: {
    async loadLinks() {
      this.links = (await useFetch<Link[]>('/api/get')).data.value || []
    },
  },
})
