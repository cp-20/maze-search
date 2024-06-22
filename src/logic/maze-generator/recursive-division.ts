import type { MazeCellState } from '@/logic/maze'
import type { MazeGenerator } from '@/logic/maze-generator'
import { initArray2D } from '@/logic/utils'

export type MazeGeneratingState =
  | 'wall'
  | 'passage'
  | 'unfilled'
  | 'red-area'
  | 'green-area'
  | 'unused'
type MazeGeneratingCell = {
  state: MazeGeneratingState
  x: number
  y: number
}

const spliceRandom = <T>(array: T[]) => array.splice(Math.floor(Math.random() * array.length), 1)[0]

export const recursiveDivisionGenerator: MazeGenerator = (width: number, height: number) => {
  const map: MazeGeneratingCell[] = Array.from({ length: width * height })
    .fill(0)
    .map((_, i) => {
      const x = i % width
      const y = Math.floor(i / width)
      const state =
        x === 0 || y === 0 || x === width - 1 || y === height - 1 || (x % 2 === 0 && y % 2 === 0)
          ? 'wall'
          : 'unfilled'
      return { state, x, y }
    })

  const posToIndex = (x: number, y: number) => y * width + x
  const getMidCell = (cell1: MazeGeneratingCell, cell2: MazeGeneratingCell) => {
    return map[posToIndex((cell1.x + cell2.x) / 2, (cell1.y + cell2.y) / 2)]
  }

  const divide = () => {
    const getNeighbors = (cell: MazeGeneratingCell, state: MazeGeneratingState) => {
      const neighbors: MazeGeneratingCell[] = []
      const directions = [
        { x: -2, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: -2 },
        { x: 0, y: 2 }
      ]
      for (const { x: dx, y: dy } of directions) {
        const x = cell.x + dx
        const y = cell.y + dy
        if (x < 0 || y < 0 || x >= width || y >= height) continue
        if (map[posToIndex(x, y)].state === state) neighbors.push(map[posToIndex(x, y)])
      }
      return neighbors
    }
    const unfilledCells = map.filter(
      ({ state, x, y }) => state === 'unfilled' && x % 2 === 1 && y % 2 === 1
    )
    if (unfilledCells.length < 2) {
      unfilledCells.forEach((cell) => (cell.state = 'passage'))
      return
    }
    const redPosition = Math.floor(Math.random() * unfilledCells.length)
    let greenPosition = Math.floor(Math.random() * unfilledCells.length)
    while (redPosition === greenPosition) {
      greenPosition = Math.floor(Math.random() * unfilledCells.length)
    }
    const redQueue = [unfilledCells[redPosition]]
    const greenQueue = [unfilledCells[greenPosition]]

    while (redQueue.length > 0 || greenQueue.length > 0) {
      while (redQueue.length > 0) {
        const cell = spliceRandom(redQueue)
        if (cell.state !== 'unfilled') continue
        cell.state = 'red-area'
        redQueue.push(...getNeighbors(cell, 'unfilled'))
        break
      }
      while (greenQueue.length > 0) {
        const cell = spliceRandom(greenQueue)
        if (cell.state !== 'unfilled') continue
        cell.state = 'green-area'
        greenQueue.push(...getNeighbors(cell, 'unfilled'))
        break
      }
    }

    const wallingCells = map
      .filter(({ state }) => state === 'red-area')
      .flatMap((redCell) =>
        getNeighbors(redCell, 'green-area').map((greenCell) => getMidCell(redCell, greenCell))
      )
    if (wallingCells.length > 0) {
      const passageCell = spliceRandom(wallingCells)
      wallingCells.forEach((cell) => (cell.state = 'wall'))
      passageCell.state = 'passage'
    }

    map.filter(({ state }) => state === 'red-area').forEach((cell) => (cell.state = 'unused'))
    map.filter(({ state }) => state === 'green-area').forEach((cell) => (cell.state = 'unfilled'))
    divide()
    map.filter(({ state }) => state === 'unused').forEach((cell) => (cell.state = 'unfilled'))
    divide()
  }
  divide()

  const maze: MazeCellState[][] = initArray2D(width, height, 'wall')
  for (const { state, x, y } of map) {
    if (state === 'wall') continue
    maze[y][x] = 'passage'
  }
  return maze
}
