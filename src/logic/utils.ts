export const initArray2D = <T>(width: number, height: number, value: T): T[][] => {
  return Array.from({ length: height }, () => Array(width).fill(value))
}

export const shuffleArray = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const minBy = <T>(array: T[], f: (item: T) => number): T | null => {
  if (array.length === 0) return null
  let minItem = array[0]
  let minValue = f(minItem)
  for (const item of array.slice(1)) {
    const value = f(item)
    if (value < minValue) {
      minValue = value
      minItem = item
    }
  }
  return minItem
}
