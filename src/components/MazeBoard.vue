<script setup lang="ts">
import MazeCell from '@/components/MazeCell.vue';

import { ref, watch } from 'vue';
import { Maze, type MazeSolverAlgorithm, calcPriority } from '@/logic/maze'

const solvers: Record<MazeSolverAlgorithm, string> = {
  'a-star': 'A*',
  'dijkstra': 'ダイクストラ法',
  'bfs': '幅優先探索',
  'dfs': '深さ優先探索',
}

const width = ref(41)
const height = ref(21)
const step = ref(0)
const interval = ref<number | undefined>(undefined)
const intervalTime = ref(100)
const state = ref<'idle' | 'running'>('idle')

const maze = ref<Maze>(new Maze('a-star', width.value, height.value))
maze.value.generate();

const start = () => {
  state.value = 'running'
  interval.value = setInterval(nextStep, intervalTime.value)
}

const stop = () => {
  state.value = 'idle'
  clearInterval(interval.value)
  interval.value = undefined
}

const nextStep = () => {
  const cell = maze.value.nextStep()
  step.value++
  if (cell === null) return stop();
  if (cell[0] === width.value - 2 && cell[1] === height.value - 1) return stop();
}

const regenerate = () => {
  maze.value.generate()
  step.value = 0
}
defineExpose({ regenerate })

watch([width, height], () => {
  maze.value = new Maze(maze.value.solver, width.value, height.value)
  regenerate()
})

const getAnnotation = (x: number, y: number) => {
  const cell = maze.value.maze[y][x]
  const cost = maze.value.cost[y][x]
  const distance = maze.value.distance[y][x]

  if (cell === 'visited') return cost
  if (cell === 'in-queue') return calcPriority(maze.value.solver, cost, distance)
  if (cell === 'start') return 'S'
  if (cell === 'goal') return 'G'

  return ''
}

</script>

<template>
  <div class="container">
    <div class="header">
      <div class="controller">
        <button class="control-button" @click="start()" :disabled="state === 'running'">スタート</button>
        <button class="control-button" @click="stop()" :disabled="state === 'idle'">ストップ</button>
        <button class="control-button" @click="regenerate()" :disabled="state === 'running'">再生成</button>
      </div>
      <div class="solver-select select">
        <label for="solver">探索アルゴリズム</label>
        <select id="solver" v-model="maze.solver" :disabled="state === 'running'">
          <option v-for="(name, key) in solvers" :value="key" :key="key">{{ name }}</option>
        </select>
      </div>
      <div class="speed-select select">
        <label for="speed">スピード</label>
        <select id="speed" v-model="intervalTime" @change="if (state === 'running') { stop(); start(); }">
          <option value="0">最速</option>
          <option value="20">速い (50マス/s)</option>
          <option value="100">普通 (10マス/s)</option>
          <option value="500">ゆっくり (2マス/s)</option>
        </select>
      </div>
      <div class="step-view">
        ステップ: {{ step }}
      </div>
    </div>
    <div class="board">
      <div v-for="(row, y) in maze.maze" class="column" :key="y">
        <div v-for="(cell, x) in row" class="row" :key="x">
          <MazeCell :state="cell" :annotation="getAnnotation(x, y)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.controller {
  display: flex;
}


.select {
  display: flex;
  gap: 8px;
}

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
