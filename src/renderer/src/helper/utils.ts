function debounce(func: (value: string) => void, delay: number): (value: string) => void {
  let timer: ReturnType<typeof setTimeout> | undefined

  return function (value: string): void {
    clearTimeout(timer)

    timer = setTimeout(() => {
      func(value)
    }, delay)
  }
}

function formatSize(bytes: number): string {
  // Handle null, undefined, or 0
  if (bytes == null || bytes === 0) {
    return '0 B'
  }

  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024

  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(1)} GB`
  } else if (bytes >= MB) {
    return `${(bytes / MB).toFixed(1)} MB`
  } else if (bytes >= KB) {
    return `${(bytes / KB).toFixed(1)} KB`
  } else {
    return `${bytes} B`
  }
}

export { debounce, formatSize }
