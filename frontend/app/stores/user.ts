export const useUserStore = defineStore("userStore", () => {
  const userType = ref<"camera" | "main">();
  const pairingCode = ref<string>();

  const currentBackground = ref<Background>();

  return { userType, pairingCode, currentBackground };
});
