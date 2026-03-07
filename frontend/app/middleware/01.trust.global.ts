export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();

  // only run on initial page load
  // https://nuxt.com/docs/guide/directory-structure/middleware#when-middleware-runs
  if (!import.meta.client || !nuxtApp.isHydrating || !nuxtApp.payload.serverRendered) return;

  const config = useRuntimeConfig();

  const { error } = await fetchEndpoint("/check");
  if (error) return void (window.location.href = `${config.public.backendUrl}/trust?redirect=${encodeURIComponent(to.path)}`);
});
