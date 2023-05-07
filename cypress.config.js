const { defineConfig } = require("cypress");
// Populate process.env with values from .env file
// require('dotenv').config()
require('dotenv').config({ path: ".env.local" })

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173/"
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
  env: {
    spotifyAccount: process.env.VITE_SPOTIFY_ACCOUNT,
    spotifyPassword: process.env.VITE_SPOTIFY_PASSWORD,
  },
});
