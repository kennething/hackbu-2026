<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed top-0 left-0 -z-10 h-svh w-svw select-none">
      <div v-for="(background, index) in activeBackgrounds" :key="Symbol(background)">
        <Transition v-for="(num, jndex) in backgrounds[background]" name="layer">
          <div
            v-show="jndex <= activeBackgroundRevealIndices[index]!"
            class="absolute top-0 left-0 h-full w-full bg-cover bg-center"
            :style="{ zIndex: `-${num}`, backgroundImage: `url('/backgrounds/${background}/layer-${num}.svg')` }"
            aria-hidden="true"
          ></div>
        </Transition>
        <Transition name="base">
          <div
            v-show="activeBackgroundRevealIndices[index]! === backgrounds[background]"
            class="absolute top-0 left-0 h-full w-full bg-cover bg-center"
            :style="{ zIndex: `-${backgrounds[background] + 1}`, backgroundImage: `url('/backgrounds/${background}/base.svg')` }"
            aria-hidden="true"
          ></div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** name of the folder in public/backgrounds to use */
  background?: Background;
}>();

/** in ms */
const animationSpeed = 1000 as const;

// jank cuz vue doesnt react to [tuple][] for some fucking reason
const activeBackgrounds = ref<Background[]>([]);
const activeBackgroundRevealIndices = ref<number[]>([]);
watch(
  () => props.background,
  (val) => {
    if (activeBackgrounds.value.length) {
      const background = activeBackgrounds.value[0]!;
      const interval = setInterval(
        () => {
          const currentIndex = activeBackgroundRevealIndices.value[0];
          if (currentIndex === undefined || currentIndex <= -1) return clearInterval(interval);
          activeBackgroundRevealIndices.value[0]!--;
        },
        animationSpeed / 2 / backgrounds[background]
      );
      setTimeout(() => {
        activeBackgrounds.value.shift();
        activeBackgroundRevealIndices.value.shift();
      }, animationSpeed * 2);
    }
    if (!val) return;

    activeBackgrounds.value.push(val);
    const length = activeBackgroundRevealIndices.value.push(-1);
    setTimeout(() => {
      const interval = setInterval(
        () => {
          const currentIndex = activeBackgroundRevealIndices.value[length - 1];
          if (currentIndex === undefined || currentIndex >= backgrounds[val]) return clearInterval(interval);
          activeBackgroundRevealIndices.value[length - 1]!++;
        },
        animationSpeed / 2 / backgrounds[val]
      );
    }, animationSpeed / 2);
  },
  { immediate: true }
);
</script>

<style scoped>
@keyframes bounce-in {
  0% {
    transform: translateY(100svh);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  70% {
    transform: translateY(-10svh);
  }
  100% {
    transform: translateY(0);
  }
}

.layer-enter-active {
  animation: bounce-in 1s ease-in-out;
}
.layer-leave-active {
  animation: bounce-in 1s ease-in-out reverse;
}

.base-enter-active {
  transition: opacity 1s ease-in-out;
}
.base-leave-active {
  transition: opacity 2s ease-in-out;
}
.base-enter-from,
.base-leave-to {
  opacity: 0;
}
</style>
