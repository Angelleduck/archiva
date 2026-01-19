function debounce(func: (value: string) => void, delay: number): (value: string) => void {
  let timer: ReturnType<typeof setTimeout> | undefined

  return function (value: string): void {
    clearTimeout(timer)

    timer = setTimeout(() => {
      func(value)
    }, delay)
  }
}

export { debounce }
