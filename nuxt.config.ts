// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "nuxt-vuefire",
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
  ],

  ssr: true,
  css: [
    "~~/css/global.css"
  ],

  vuefire: {
    config: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: "lightboard-0",
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGE_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    }
  },
})
