export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  if (!userStore.pairingCode) return navigateTo("/");
});
