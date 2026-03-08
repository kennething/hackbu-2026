<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex min-h-svh flex-col items-center justify-center">
      <video v-show="stream" ref="video" class="w-[80svw] rounded-4xl" autoplay playsinline muted></video>

      <div v-if="!pairingConfirmed" v-show="!stream" class="flex flex-col items-center justify-center gap-6">
        <div class="skeleton aspect-4/3 h-[107svw] w-[80svw] rounded-4xl"></div>

        <div class="flex flex-col items-center justify-center gap-2">
          <h1 class="text-center text-2xl font-medium">Hmmm... that's not right</h1>
          <p class="text-center text-lg">We need your camera to continue!</p>
          <button @click="getCamera" class="mt-4 rounded-xl bg-blue-500 px-4 py-2 text-white">Give permission</button>
        </div>
      </div>

      <div v-else-if="pairingConfirmed && !centerConfirmed" class="mt-6 flex flex-col items-center justify-center gap-2">
        <h2 class="text-center text-2xl font-bold">Center your paper!</h2>
        <p class="text-center text-neutral-800">Ensure your paper is entirely within the frame. This will be the paper you write on.</p>
        <button class="mt-4 rounded-xl bg-green-500 px-4 py-2 text-white" @click="confirmCentered!">It's centered!</button>
      </div>

      <div v-else class="mt-6 flex flex-col items-center justify-center gap-2">
        <h2 class="text-center text-2xl font-bold">All set!</h2>
        <p class="text-center text-neutral-800">Continue on your other device, but keep this device centered and on this tab!</p>
        <button @click="$socket.emit('terminatePairing')" class="mt-4 rounded-xl bg-red-400 px-4 py-2 text-white">Disconnect</button>
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
let interval: NodeJS.Timeout;
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
    interval = setInterval(emitFrame, 500);
  } catch (error) {
    console.error("error accessing camera:", error);
  }
}
onBeforeUnmount(stop);
function stop() {
  if (interval) clearInterval(interval);
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = undefined;
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
      // TODO: add callback
      if (blob) $socket.emit("pollFrame", blob, () => {});
    },
    "image/webp",
    quality
  );
}

const pairingConfirmed = ref(false);
const confirmCentered = ref<CallbackFn>();
const centerConfirmed = ref(false);
onMounted(() => {
  if (!$socket.hasListeners("terminatePairing")) $socket.on("terminatePairing", () => window.close());
  if (!$socket.hasListeners("pairingConfirmed"))
    $socket.on("pairingConfirmed", (callback) => {
      pairingConfirmed.value = true;
      confirmCentered.value = () => {
        centerConfirmed.value = true;
        callback(true);
      };
    });
});
onBeforeUnmount(() => {
  if ($socket.hasListeners("terminatePairing")) $socket.off("terminatePairing");
  if ($socket.hasListeners("pairingConfirmed")) $socket.off("pairingConfirmed");
});
</script>

<style scoped>
@keyframes skeleton {
  0%,
  100% {
    background-color: #303030;
  }
  50% {
    background-color: #404040;
  }
}
.skeleton {
  animation: skeleton 1.5s infinite;
}
</style>
