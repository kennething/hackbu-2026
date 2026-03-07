import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/main.css"],
  modules: ["@pinia/nuxt", "@formkit/auto-animate"],
  vite: {
    // @ts-expect-error sybau
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    public: {
      backendUrl: ""
    }
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
    head: {
      title: "ChickenScratch",
      meta: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "author", content: "HackBU" },
        { property: "og:title", content: "ChickenScratch" },
        { property: "og:site_name", content: "ChickenScratch" }
      ]
      // link: [{ rel: "icon", type: "image/svg+xml", href: "/bword-shunt.svg" }]
    }
  }
});
