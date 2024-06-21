<script setup lang="ts">
import PresentialMazeBoard from '@/components/PresentialMazeBoard.vue';

import { computed, ref, watch } from 'vue';
import { Maze, type MazeSolverAlgorithm } from '@/logic/maze'

const solvers: Record<MazeSolverAlgorithm, string> = {
  'a-star': 'A*',
  'random': 'ランダム法',
  'bfs': '幅優先探索',
  'dfs': '深さ優先探索',
}

const width = ref(41)
const widthAtom = computed({
  get: () => (width.value - 1) / 2,
  set: (value) => width.value = value * 2 + 1,
})
const height = ref(21)
const heightAtom = computed({
  get: () => (height.value - 1) / 2,
  set: (value) => height.value = value * 2 + 1,
})
const steps = ref<number[]>([0, 0, 0, 0])
const solved = ref<boolean[]>([false, false, false, false])
const interval = ref<number | undefined>(undefined)
const intervalTime = ref(100)
const state = ref<'idle' | 'running'>('idle')

const initialMazes = computed(() => [
  new Maze('bfs', width.value, height.value),
  new Maze('dfs', width.value, height.value),
  new Maze('random', width.value, height.value),
  new Maze('a-star', width.value, height.value),
])
const mazes = ref<Maze[]>(initialMazes.value)

const regenerate = () => {
  const maze = mazes.value[0]
  maze.generate();
  mazes.value[1] = maze.copyWith({ solver: 'dfs' })
  mazes.value[2] = maze.copyWith({ solver: 'random' })
  mazes.value[3] = maze.copyWith({ solver: 'a-star' })
  steps.value = [0, 0, 0, 0]
  solved.value = [false, false, false, false]
}

regenerate()

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
  for (let i = 0; i < mazes.value.length; i++) {
    if (solved.value[i]) continue

    const cell = mazes.value[i].nextStep()
    steps.value[i] += cell === null ? 0 : 1
    if (cell === null) {
      solved.value[i] = true
      continue
    }
    if (cell[0] === width.value - 2 && cell[1] === height.value - 1) {
      solved.value[i] = true
      continue
    }
  }
  if (solved.value.every((s) => s)) stop()
}
defineExpose({ regenerate })

watch([width, height], () => {
  mazes.value = initialMazes.value
  regenerate()
})
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="board-size">
        <label for="width">幅</label>
        <input id="width" type="number" v-model="widthAtom" min="5" max="101" :disabled="state === 'running'" />
        <label for="height">高さ</label>
        <input id="height" type="number" v-model="heightAtom" min="5" max="101" :disabled="state === 'running'" />
      </div>
      <div class="controller">
        <button class="control-button" @click="start()" :disabled="state === 'running'">スタート</button>
        <button class="control-button" @click="stop()" :disabled="state === 'idle'">ストップ</button>
        <button class="control-button" @click="regenerate()" :disabled="state === 'running'">再生成</button>
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
    </div>
    <div class="boards">
      <div v-for="(maze, i) in mazes" :key="maze.solver" class="board" :class="{ finished: solved[i] }">
        <div class="board-header">
          <h2 class="board-title">{{ solvers[maze.solver] }}</h2>
          <div class="board-step">ステップ: {{ steps[i] }}</div>
        </div>
        <PresentialMazeBoard class="board-main" :maze="maze.maze" :solver="maze.solver" :cost="maze.cost"
          :distance="maze.distance" />
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

.board-size {
  display: flex;
  gap: 8px;
}

.controller {
  display: flex;
}

.select {
  display: flex;
  gap: 8px;
}

.boards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.board-main {
  position: relative;
}

.board.finished .board-step {
  color: hsl(0, 70%, 50%);
  font-weight: bold;
}

.board.finished .board-main::after {
  content: 'SOLVED';
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: #fff7;
  display: grid;
  place-items: center;
  font-size: 2rem;
  font-weight: bold;
  color: orange;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.board-title {
  font-size: 1.2rem;
}
</style>
