export default defineNuxtRouteMiddleware((to) => {
  const nuxtApp = useNuxtApp();
  if (!import.meta.client || !nuxtApp.payload.serverRendered) return;

  const userStore = useUserStore();
  userStore.currentBackground = to.meta.background;
});
