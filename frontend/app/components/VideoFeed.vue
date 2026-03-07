<template>
  <div class="flex flex-col items-center justify-center" v-if="currentImage">
    <img :src="currentImage" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
const { $socket } = useNuxtApp();

const emit = defineEmits<{ hasFrame: [void] }>();

const currentFrame = ref<ArrayBuffer>();
const currentImage = computed(() => (currentFrame.value ? URL.createObjectURL(new Blob([currentFrame.value])) : undefined));
onMounted(() => {
  if (!$socket.hasListeners("getFrame"))
    $socket.on("getFrame", (blob) => {
      currentFrame.value = blob;
      emit("hasFrame");
    });
});
onBeforeUnmount(() => {
  if ($socket.hasListeners("getFrame")) $socket.off("getFrame");
});
</script>

<style scoped></style>
