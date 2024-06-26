import type { MazeCellState } from '@/logic/maze'
import { dfsGenerator } from '@/logic/maze-generator/dfs'
import { primGenerator } from '@/logic/maze-generator/prim'
import { recursiveDivisionGenerator } from '@/logic/maze-generator/recursive-division'

export type MazeGeneratorAlgorithm = 'dfs' | 'prim' | 'recursive-division'

export type MazeGenerator = (width: number, height: number) => MazeCellState[][]

export const mazeGenerators: Record<MazeGeneratorAlgorithm, MazeGenerator> = {
  dfs: dfsGenerator,
  prim: primGenerator,
  'recursive-division': recursiveDivisionGenerator
}
