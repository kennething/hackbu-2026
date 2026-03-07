<template>
  <div>
    <div class="flex flex-col items-center justify-center" v-if="!isConnected">
      <h2>scan this qr code with a mobile device</h2>
      <canvas ref="qr-canvas"></canvas>
    </div>

    <Teleport :to="videoFeed" :disabled="!isConnected">
      <VideoFeed @has-frame="isConnected = true" />
    </Teleport>
    <div v-show="isConnected" class="flex items-center justify-around">
      <button class="" @click="$socket.emit('confirmPair', () => navigateTo('/home'))">yes</button>
      <div ref="video-feed"></div>
      <button @click="$socket.emit('terminatePairing')">no</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from "qrcode";

definePageMeta({
  background: "forest"
});

const { $socket } = useNuxtApp();

const qrCanvas = useTemplateRef("qr-canvas");
const unwatchCanvas = watch(qrCanvas, (canvas) => {
  if (!canvas) return;
  $socket.connect();

  const normalizedHref = window.location.href.endsWith("/") ? window.location.href.slice(0, -1) : window.location.href;
  $socket.emit("connectMainSocket", (_, code) => QRCode.toCanvas(qrCanvas.value, `${normalizedHref}/${code}`, { color: { light: "#ff0000", dark: "#00ff00" } }));

  unwatchCanvas();
});

const isConnected = ref(false);
const videoFeed = useTemplateRef("video-feed");

onMounted(() => {
  if (!$socket.hasListeners("terminatePairing")) $socket.on("terminatePairing", () => navigateTo("/"));
});
</script>

<style scoped></style>
