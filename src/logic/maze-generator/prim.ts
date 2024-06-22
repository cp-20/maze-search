import type { MazeCellState } from '@/logic/maze'
import type { MazeGenerator } from '@/logic/maze-generator'
import { initArray2D, minBy, shuffleArray } from '@/logic/utils'

export const primGenerator: MazeGenerator = (mapWidth, mapHeight) => {
  const width = (mapWidth - 1) / 2
  const height = (mapHeight - 1) / 2

  const bigEnough = 999

  const initializer = () => {
    const adj: number[][] = Array.from({ length: width * height }, () => [])
    const cost: (number | null)[][] = initArray2D(width * height, width * height, null)

    const addVertex = (v: number) => {
      if (v % width < width - 1) {
        addEdge(v, v + 1, 1) // 右の頂点
      }
      if (Math.floor(v / width) < height - 1) {
        addEdge(v, v + width, 1) // 下の頂点
      }
    }

    const addEdge = (e1: number, e2: number, w: number) => {
      adj[e1].push(e2)
      adj[e2].push(e1)

      if (cost[e1] === null) {
        cost[e1] = Array(width * height).fill(null)
      }
      ;(cost[e1] as number[])[e2] = w

      if (cost[e2] === null) {
        cost[e2] = Array(width * height).fill(null)
      }
      ;(cost[e2] as number[])[e1] = w
    }

    for (let i = 0; i < width * height; i++) {
      addVertex(i)
    }

    return {
      adj: adj as number[][],
      cost: cost as (number | null)[][]
    }
  }

  const { adj, cost } = initializer()
  const map: MazeCellState[][] = initArray2D(mapWidth, mapHeight, 'wall')

  const mapCoords = (v: number): [number, number] => {
    const x = 1 + 2 * (v % width)
    const y = 1 + 2 * Math.floor(v / width)
    return [x, y]
  }

  const iota = (n: number): number[] => Array.from({ length: n }, (_, i) => i)

  const queue = shuffleArray(iota(width * height))
  const edges: (number | null)[] = Array(width * height).fill(null)
  const costs: number[] = Array(width * height).fill(bigEnough)

  while (queue.length > 0) {
    const v = minBy(queue, (u) => costs[u])
    if (v === null) break
    queue.splice(queue.indexOf(v), 1)

    for (const w of adj[v]) {
      if (queue.includes(w) && (cost[v][w] as number) < costs[w]) {
        costs[w] = cost[v][w] as number
        edges[w] = v
      }
    }
  }

  const midpoint = (a: number, b: number): number => Math.floor((a + b) / 2)

  for (let i = 0; i < width * height; i++) {
    const [x, y] = mapCoords(i)
    map[y][x] = 'passage'

    const edge = edges[i]
    if (edge !== null) {
      const [x2, y2] = mapCoords(edge)
      const mx = midpoint(x, x2)
      const my = midpoint(y, y2)
      map[my][mx] = 'passage'
    }
  }

  return map
}
