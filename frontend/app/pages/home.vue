<template>
  <div class="flex flex-col items-center justify-center">
    <VideoFeed class="fixed top-4 right-4 aspect-4/3 w-20" />

    <h1>ur connected!</h1>
    <button>race</button>
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
