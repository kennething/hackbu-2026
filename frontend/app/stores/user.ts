export const useUserStore = defineStore("userStore", () => {
  const pairingCode = ref<string>();

  const currentBackground = ref<Background>();
  const videoFeedOption = reactive({
    size: "small" as "small" | "large",
    position: "right" as "left" | "right"
  });

  return { pairingCode, currentBackground, videoFeedOption };
});
