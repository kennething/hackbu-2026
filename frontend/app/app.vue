<template>
  <Background :background="currentBackground" />

  <NuxtPage />
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { currentBackground } = storeToRefs(userStore);
</script>

<style>
.page-enter-active {
  transition: opacity 1s;
}
.page-leave-active {
  transition: opacity 1.5s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
