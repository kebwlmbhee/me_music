import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return tag.startsWith('v-') // (return true), 避免 Vitest 跳警告 v-xxx 無法 resolve
          }
        }
      }
    }),
  ],
  // base: "/me_music/",   // Deal with the path problem when deploying to GitLab or GitHub
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})