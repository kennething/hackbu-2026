<template>
  <div class="flex flex-col items-center justify-center"></div>
</template>

<script setup lang="ts">
definePageMeta({
  background: "forest",
  middleware: "has-pair",
  layout: "connected"
});

useStandardTerminate();
</script>

<style scoped></style>
