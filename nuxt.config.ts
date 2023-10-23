// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  vite: {
    optimizeDeps: {
      exclude: [
        "~/node_modules/libass-wasm/dist/js/subtitles-octopus.js?url",
        "~/node_modules/libass-wasm/dist/js/subtitles-octopus-worker.js?url",
        "~/node_modules/libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url",
      ],
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
});
