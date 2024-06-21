<script setup lang="ts">
import MazeCell from '@/components/MazeCell.vue';

import { calcPriority, type MazeCellState, type MazeSolverAlgorithm } from '@/logic/maze';

const props = defineProps<{
  solver: MazeSolverAlgorithm;
  cost: number[][];
  distance: number[][];
  maze: MazeCellState[][];
}>();

const getAnnotation = (x: number, y: number) => {
  const cell = props.maze[y][x]
  const cost = props.cost[y][x]
  const distance = props.distance[y][x]

  if (cell === 'visited') return cost
  if (cell === 'in-queue') return calcPriority(props.solver, cost, distance)
  if (cell === 'start') return 'S'
  if (cell === 'goal') return 'G'

  return ''
}
</script>

<template>
  <div class="board">
    <div v-for="(row, y) in maze" class="column" :key="y">
      <div v-for="(cell, x) in row" class="row" :key="x">
        <MazeCell :state="cell" :annotation="getAnnotation(x, y)" />
      </div>
    </div>
  </div>
</template>

<style>
.column {
  display: flex;
}

.column:not(:first-of-type) {
  margin-top: -1px;
}

.row:not(:first-of-type) {
  margin-left: -1px;
}
</style>
