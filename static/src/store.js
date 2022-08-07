export default {
  data() {
    return {
      links: [],
      isFull: true,
    }
  },
  created() {
    this.getLinks()
    this.calculateFull()
  },
  methods: {
    async getLinks() {
      this.links = (await this.$api.get('api/get')).data
    },
    calculateFull() {
      this.isFull = window.innerWidth > 800
    },
    _resize() {
      this.calculateFull()
    },
  },
}
