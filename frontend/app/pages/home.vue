<template>
  <div class="flex min-h-svh flex-col items-center justify-center">
    <h1 class="title text-6xl font-medium">You're connected!</h1>
    <NuxtLink to="/play/queue">race</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  background: "mountains",
  middleware: "has-pair",
  layout: "connected"
});

useStandardTerminate();
</script>

<style scoped></style>
