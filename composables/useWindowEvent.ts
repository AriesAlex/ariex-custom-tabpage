export default (
  event: string,
  callback: EventListenerOrEventListenerObject,
  immediate: boolean = true
) => {
  onMounted(() => {
    if (immediate) (callback as Function)()
    window.addEventListener(event, callback)
  })
  onUnmounted(() => window.removeEventListener(event, callback))
}
