<template>
  <div class="flex min-h-svh flex-col items-center justify-center">
    <span class="loading loading-bars"></span>
    <h1 class="title text-5xl">Looking for an opponent...</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  background: "forest",
  middleware: "has-pair",
  layout: "connected"
});

useStandardTerminate();
</script>

<style scoped>
@reference "../../assets/main.css";

/**
taken from DaisyUI source
@see https://github.com/saadeghi/daisyui/
*/
.loading {
  @apply pointer-events-none inline-block aspect-square bg-current align-middle;
  width: calc(var(--size-selector, 0.25rem) * 40);
  mask-size: 100%;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='black' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform-origin='center'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 12 12' to='360 12 12' dur='2s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dasharray' values='0,150;42,150;42,150' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dashoffset' values='0;-16;-59' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");
}
.loading-bars {
  mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='6' height='22'%3E%3Canimate attributeName='y' values='1;5;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='height' values='22;14;22' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='1;0.2;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect x='9' y='1' width='6' height='22'%3E%3Canimate attributeName='y' values='1;5;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.65s'/%3E%3Canimate attributeName='height' values='22;14;22' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.65s'/%3E%3Canimate attributeName='opacity' values='1;0.2;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.65s'/%3E%3C/rect%3E%3Crect x='17' y='1' width='6' height='22'%3E%3Canimate attributeName='y' values='1;5;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.5s'/%3E%3Canimate attributeName='height' values='22;14;22' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.5s'/%3E%3Canimate attributeName='opacity' values='1;0.2;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.5s'/%3E%3C/rect%3E%3C/svg%3E");
}
</style>
