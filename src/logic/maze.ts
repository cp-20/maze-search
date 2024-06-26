// generated with GPT-4o

import { mazeGenerators, type MazeGeneratorAlgorithm } from '@/logic/maze-generator'
import { PriorityQueue } from '@/logic/priority-queue'
import { initArray2D } from '@/logic/utils'

export type MazeSolverAlgorithm = 'bfs' | 'dfs' | 'random' | 'a-star'

export type MazeCellState = 'start' | 'goal' | 'passage' | 'in-queue' | 'visited' | 'wall'

export const calcPriority = (solver: MazeSolverAlgorithm, cost: number, distance: number) => {
  switch (solver) {
    case 'bfs':
      return cost
    case 'dfs':
      return -cost
    case 'random':
      return Math.floor(Math.random() * 100)
    case 'a-star':
      return cost + distance
  }
}

export class Maze {
  private _solver: MazeSolverAlgorithm
  private _generator: MazeGeneratorAlgorithm
  private _width: number
  private _height: number
  // 0 = passage, 1 = wall
  private _maze: MazeCellState[][]
  private _distance: number[][]
  private _cost: number[][]
  private queue: PriorityQueue<{ x: number; y: number }>

  constructor(
    solver: MazeSolverAlgorithm,
    generator: MazeGeneratorAlgorithm,
    width: number,
    height: number
  ) {
    if (width % 2 === 0 || height % 2 === 0) {
      throw new Error('Width and height must be odd numbers')
    }
    this._solver = solver
    this._generator = generator
    this._width = width
    this._height = height
    this._maze = initArray2D(this._width, this._height, 'wall')
    this._distance = initArray2D(this._width, this._height, Infinity)
    this._cost = initArray2D(this._width, this._height, 0)
    this.queue = new PriorityQueue<{
      x: number
      y: number
    }>([{ value: { x: 1, y: 0 }, cost: 0 }])
  }

  public generate() {
    this._distance = initArray2D(this._width, this._height, Infinity)
    this._cost = initArray2D(this._width, this._height, 0)
    this.queue = new PriorityQueue<{ x: number; y: number }>([{ value: { x: 1, y: 0 }, cost: 0 }])

    // 左上 (スタート) から迷路を生成
    this._maze = mazeGenerators[this._generator](this._width, this._height)

    // スタートとゴールを設定
    this._maze[0][1] = 'start'
    this._maze[this._height - 1][this._width - 2] = 'goal'

    // 各マスの距離を初期化
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        if (this._maze[y][x] === 'wall') {
          this._distance[y][x] = -1
        } else {
          this._distance[y][x] = this.calcDistance(x, y, this._width - 2, this._height - 1)
        }
      }
    }
  }

  public nextStep() {
    const current = this.queue.dequeue()
    if (!current) return null

    const x = current.value.x
    const y = current.value.y
    this._maze[y][x] = 'visited'

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0]
    ]

    for (const [dx, dy] of directions) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || nx >= this._width) continue
      if (ny < 0 || ny >= this._height) continue
      if (this._maze[ny][nx] === 'wall') continue
      if (this._maze[ny][nx] === 'visited') continue

      const newCost = this._cost[y][x] + 1
      if (this._cost[ny][nx] === 0 || newCost < this._cost[ny][nx]) {
        this._cost[ny][nx] = newCost
        this.queue.enqueue(
          { x: nx, y: ny },
          calcPriority(this._solver, newCost, this._distance[ny][nx])
        )
        if (this._maze[ny][nx] === 'passage') {
          this._maze[ny][nx] = 'in-queue'
        }
      }
    }

    return [x, y] as const
  }

  public copyWith({
    solver,
    generator,
    width,
    height
  }: Partial<{
    solver: MazeSolverAlgorithm
    generator: MazeGeneratorAlgorithm
    width: number
    height: number
  }>): Maze {
    const maze = new Maze(
      solver ?? this._solver,
      generator ?? this._generator,
      width ?? this._width,
      height ?? this._height
    )
    maze._maze = this._maze.map((row) => row.slice())
    maze._distance = this._distance.map((row) => row.slice())
    maze._cost = this._cost.map((row) => row.slice())
    maze.queue = new PriorityQueue<{ x: number; y: number }>([...this.queue.toArray()])
    return maze
  }

  private calcDistance(x1: number, y1: number, x2: number, y2: number): number {
    // マンハッタン距離
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
  }

  set solver(solver: MazeSolverAlgorithm) {
    this._solver = solver
  }
  get solver(): MazeSolverAlgorithm {
    return this._solver
  }
  get generator(): MazeGeneratorAlgorithm {
    return this._generator
  }
  get width(): number {
    return this._width
  }
  get height(): number {
    return this._height
  }
  get maze(): MazeCellState[][] {
    return this._maze
  }
  get distance(): number[][] {
    return this._distance
  }
  get cost(): number[][] {
    return this._cost
  }
}
