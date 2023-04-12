export default (condition: Function) => {
  return new Promise<void>(resolve => {
    const int = setInterval(() => {
      if (!condition()) return
      clearInterval(int)
      resolve()
    }, 10)
  })
}
