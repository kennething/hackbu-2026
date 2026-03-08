export const useUserStore = defineStore("userStore", () => {
  const pairingCode = ref<string>();

  const currentBackground = ref<Background>();
  const videoFeedOptions = reactive({
    size: "small" as "small" | "large",
    position: "right" as "left" | "right"
  });

  const currentWord = ref<string>();

  return { pairingCode, currentBackground, videoFeedOptions, currentWord };
});
