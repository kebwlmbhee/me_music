// 參考: https://github.com/ZhiRongDev/vuetify-vite-ts-test
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Resolver
  resolve: {
    // https://vitejs.dev/config/#resolve-alias
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // plugins
  plugins: [
    // Vue3
    vue(),
    // Vuetify Loader
    // https://github.com/vuetifyjs/vuetify-loader
    vuetify({
      autoImport: true,
      styles: { configFile: './src/styles/variables.scss' },
    }),
  ],
  test: {
    // https://vitest.dev/guide/#configuring-vitest
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['vuetify'],
    },
    // 用來解決 Vitest 執行 mount 發生 ReferenceError: ResizeObserver is not defined 問題
    // https://github.com/vuetifyjs/vuetify/issues/14749#issuecomment-1481141623
    setupFiles: ['./setup.js'],
  },
});