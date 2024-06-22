import type { MazeCellState } from '@/logic/maze'

export type MazeGeneratorAlgorithm = 'dfs' | 'prim' | 'recursive-division'

export type MazeGenerator = (width: number, height: number) => MazeCellState[][]
