<template>
  <div class="w-full">
    <div class="flex min-h-svh flex-col items-center justify-center gap-20" v-if="!isConnected">
      <h2 class="text-center text-4xl font-medium">Scan this QR Code with a mobile device</h2>
      <canvas ref="qr-canvas"></canvas>
    </div>

    <Teleport :to="videoFeed" :disabled="!isConnected">
      <VideoFeed class="overflow-hidden rounded-4xl" @has-frame="isConnected = true" />
    </Teleport>

    <div v-show="isConnected" class="flex min-h-svh w-full flex-col items-center justify-center gap-20">
      <h2 class="text-center text-4xl font-medium">{{ !isPaired ? "Is this you?" : "Follow the instructions on your other device" }}</h2>

      <div class="flex w-full items-center justify-around">
        <Transition name="confirmation-button">
          <button v-show="isConnected && !isPaired" class="rounded-xl bg-neutral-300 px-20 py-5 text-2xl" @click="confirmPair">yes</button>
        </Transition>
        <div ref="video-feed"></div>
        <Transition name="confirmation-button">
          <button v-show="isConnected && !isPaired" class="rounded-xl bg-neutral-300 px-20 py-5 text-2xl" @click="$socket.emit('terminatePairing')">no</button>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from "qrcode";

definePageMeta({
  background: "forest"
});

const { $socket } = useNuxtApp();

const userStore = useUserStore();
const { pairingCode } = storeToRefs(userStore);

const qrCanvas = useTemplateRef("qr-canvas");
const unwatchCanvas = watch(qrCanvas, (canvas) => {
  if (!canvas) return;
  $socket.connect();

  const normalizedHref = window.location.href.endsWith("/") ? window.location.href.slice(0, -1) : window.location.href;
  $socket.emit("connectMainSocket", (_, code) => {
    pairingCode.value = code;
    QRCode.toCanvas(qrCanvas.value, `${normalizedHref}/${code}`, { color: { light: "#56deff", dark: "#303030" }, width: 275, margin: 1, errorCorrectionLevel: "low" });
  });

  unwatchCanvas();
});

const isConnected = ref(false);
const videoFeed = useTemplateRef("video-feed");

const isPaired = ref(false);
function confirmPair() {
  isPaired.value = true;
  $socket.emit("confirmPair", () => navigateTo("/home"));
}

useStandardTerminate();
</script>

<style scoped>
.confirmation-button-enter-active,
.confirmation-button-leave-active {
  transition:
    transform 0.5s ease-out,
    opacity 0.35s ease-in-out;
}
.confirmation-button-enter-from,
.confirmation-button-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
