import MobileDetect from 'mobile-detect'

const MOBILE_WIDTH = 800

export default () => {
  const userAgentHeader = useRequestHeaders()['user-agent']

  const ssrInitialGuess = process.server
    ? new MobileDetect(userAgentHeader ?? '')
    : new MobileDetect(navigator.userAgent)

  const isFull = ref(ssrInitialGuess.mobile() == null)
  useWindowEvent(
    'resize',
    () => (isFull.value = window.innerWidth > MOBILE_WIDTH),
    true
  )
  return isFull
}
