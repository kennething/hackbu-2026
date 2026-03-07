<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-col items-center justify-center">
      <video v-show="stream" ref="video" class="h-[50lvh]" autoplay playsinline muted></video>
      <div v-if="!pairingConfirmed" v-show="!stream">
        <h1>cant get ur camera stupid</h1>
        <button @click="getCamera">try again</button>
      </div>
      <div v-else>
        <h1>center the paper on ur screen</h1>
        <button @click="confirmCentered!">it's centered</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  background: "mountains",
  middleware: (to) => {
    if (!to.params.code) return navigateTo("/");
  }
});

const { $socket } = useNuxtApp();

const route = useRoute();
const code = String(route.params.code);

onMounted(() => {
  $socket.connect();

  $socket.emit("pair", code, (success) => {
    if (success) return;
    $socket.disconnect();
    navigateTo("/");
  });
});

const video = useTemplateRef("video");
const stream = ref<MediaStream>();

onMounted(getCamera);
async function getCamera() {
  if (!video.value) return;

  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    const track = stream.value.getVideoTracks()[0];
    const settings = track?.getCapabilities();
    // @ts-expect-error sybau
    if (settings?.torch) track?.applyConstraints({ advanced: [{ torch: true }] });
    video.value.srcObject = stream.value;
    video.value.play();
    setInterval(emitFrame, 500);
  } catch (error) {
    console.error("error accessing camera:", error);
  }
}

function emitFrame() {
  if (!video.value) return;

  const canvas = document.createElement("canvas");
  canvas.height = 480;
  canvas.width = 360;

  const ctx = canvas.getContext("2d");
  ctx?.drawImage(video.value, 0, 0, canvas.width, canvas.height);

  /** 0-1, lower = smaller */
  const quality = 0.5 as const;
  canvas.toBlob(
    (blob) => {
      if (blob) $socket.emit("pollFrame", blob);
    },
    "image/webp",
    quality
  );
}

const pairingConfirmed = ref(false);
const confirmCentered = ref<CallbackFn>();
onMounted(() => {
  if (!$socket.hasListeners("terminatePairing")) $socket.on("terminatePairing", () => navigateTo("/"));
  if (!$socket.hasListeners("pairingConfirmed"))
    $socket.on("pairingConfirmed", (callback) => {
      pairingConfirmed.value = true;
      confirmCentered.value = callback;
    });
});
</script>

<style scoped></style>
