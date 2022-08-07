<script>
let _windowEvents = ['scroll', 'resize']

export default {
  created() {
    _windowEvents.forEach(event => {
      if (this['_' + event]) window.addEventListener(event, this['_' + event])
    })
  },
  destroyed() {
    _windowEvents.forEach(event => {
      if (this['_' + event])
        window.removeEventListener(event, this['_' + event])
    })
  },
}
</script>
