<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-8">
    <h1 class="title text-6xl text-black">ChickenScratch</h1>
    <p class="text-lg text-black">Bottom text</p>
    <NuxtLink to="/pair" class="rounded-full bg-sky-300 px-20 py-4 text-2xl font-bold text-black">Go</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  background: "mountains"
});
</script>

<style scoped></style>
