<script setup lang="ts">
import MazeBoard from '@/components/MazeBoard.vue';
</script>

<template>
  <div class="app">
    <MazeBoard ref="boardRef" />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>
