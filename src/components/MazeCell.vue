<script setup lang="ts">
import type { MazeCellState } from '@/logic/maze';

// 各方向のセルに壁があるか否か
type Props = { state: MazeCellState; annotation?: number | string; };

defineProps<Props>();

</script>

<template>
  <div class="cell" :class="{ [state]: true }">
    {{ annotation }}
  </div>
</template>

<style scoped>
.cell {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  position: relative;
  font-size: 12px;
  font-weight: bold;
}

.cell.start {
  background-color: yellowgreen;
  color: hsl(120, 50%, 30%);
}

.cell.goal {
  background-color: tomato;
  color: hsl(9, 100%, 10%);
}

.cell.passage {
  background-color: #fff;
}

.cell.in-queue {
  background-color: lightgreen;
  color: hsl(120, 50%, 40%);
}

.cell.visited {
  background-color: lightblue;
  font-weight: bold;
  color: hsl(203, 92%, 60%)
}

.cell.wall {
  background-color: gray;
  border: 1px solid #333;
  z-index: 1;
}
</style>
