<template>
  <div class="d-flex flex-column align-center justify-center" style="height: 100vh">
    <div class="d-flex flex-column align-center">
      <h1 class="title-text">歡迎來到 政大迷音</h1>
      <v-img :width="800" aspect-ratio="16/9" cover src="/loginPage.jpg"></v-img>
      <v-btn
        class="ma-5"
        size="x-large"
        v-on:click="getToken"
        data-test="login-btn"
        color="secondary"
      >
        Login with spotify
      </v-btn>
    </div>
  </div>
</template>

<style>
.title-text {
  font-size: 40pt;
}
</style>

<script>
export default {
  data() {
    return {
      authUrl: ''
    }
  },
  methods: {
    checkLogin() {
      const tokenValid = localStorage.getItem('authCode')
      if (tokenValid !== null) {
        // Redirect to home page
        this.$router.replace('/Home')
      }
    },
    generateRandomString(length) {
      let text = ''
      let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text
    },
    generateAuthUrl() {
      // 在這邊改授權協定
      const scope =
        'streaming \
            user-top-read \
            user-read-email \
            user-read-private \
            user-read-recently-played \
            user-modify-playback-state \
            user-library-read \
            user-follow-read'

      const state = this.generateRandomString(16)
      const auth_query_parameters = new URLSearchParams({
        // Spotify Authorization Code Flow 規定要用 'code'
        response_type: 'code',
        client_id: import.meta.env.VITE_CLIENT_ID,
        scope: scope,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        state: state,
        show_dialog: true // 加入這行以後，每次登入都會要求授權
      })

      // 設定 Spotify 授權跳轉網址，授權完以後會回傳 /callback 路由網址，路由會跳到 CallbackView.vue
      this.authUrl = 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString()
    },
    getToken() {
      // Please check the CallbackView.vue for the next step (Spotify will return url with /callback)
      // 跳轉到 Spotify 授權網址 (使用者按同意的那頁)
      window.location.href = this.authUrl
    }
  },
  mounted() {
    this.checkLogin()
    this.generateAuthUrl()
  }
}
</script>
