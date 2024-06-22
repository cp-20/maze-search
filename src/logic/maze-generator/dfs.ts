import type { MazeCellState } from '@/logic/maze'
import type { MazeGenerator } from '@/logic/maze-generator'
import { shuffleArray, initArray2D } from '@/logic/utils'

export const dfsGenerator: MazeGenerator = (width, height) => {
  const getNeighbors = (x: number, y: number, width: number, height: number) => {
    const neighbors = [
      { x: x - 2, y },
      { x: x + 2, y },
      { x, y: y - 2 },
      { x, y: y + 2 }
    ]
    shuffleArray(neighbors)
    return neighbors.filter(({ x, y }) => x > 0 && x < width - 1 && y > 0 && y < height - 1)
  }

  const maze = initArray2D<MazeCellState>(width, height, 'wall')
  const stack = [{ x: 1, y: 1 }]
  maze[1][1] = 'passage'

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors = getNeighbors(current.x, current.y, width, height)

    const unvisitedNeighbors = neighbors.filter(({ x, y }) => maze[y][x] === 'wall')

    if (unvisitedNeighbors.length === 0) {
      stack.pop()
      continue
    }

    const next = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)]
    maze[next.y][next.x] = 'passage'
    maze[(current.y + next.y) / 2][(current.x + next.x) / 2] = 'passage'
    stack.push(next)
  }

  return maze
}
