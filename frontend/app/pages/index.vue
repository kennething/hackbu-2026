<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="cherry-bomb-one text-6xl text-black">Very Cool App Name</h1>
    <p class="text-lg text-black">Bottom text</p>
    <NuxtLink to="/pair" class="rounded-full bg-sky-300 px-20 py-4 text-2xl font-bold text-black">Go</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  background: "mountains"
});

const route = useRoute();
const router = useRouter();

onMounted(() => {});
</script>

<style scoped></style>
