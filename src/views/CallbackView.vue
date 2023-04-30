<!--  Spotify 授權成功以後，跳轉回來的暫時頁面，用來處理取得 Token，並把他存到 @/stores 的 UserStatus.js 用 Pinia 做全域的管理 -->
<template>
  <div></div>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import qs from 'qs'
import axios from 'axios'

export default {
  data() {
    return {}
  },
  computed: {
    // 用來取得 @/stores/UserStatus.js 的 state 或 getters 區域資料
    ...mapState(UserStatus, ['authCode'])
  },
  methods: {
    // 用來取得 @/stores/UserStatus.js 的 action 區域函數
    ...mapActions(UserStatus, ['UpdateUser']),

    getTokenURL() {
      const fullUrl = window.location.href
      const queryString = fullUrl.replace(import.meta.env.VITE_REDIRECT_URI, '')
      const urlParams = new URLSearchParams(queryString)
      let code = urlParams.get('code')

      let auth_string = import.meta.env.VITE_CLIENT_ID + ':' + import.meta.env.VITE_CLIENT_SECRET
      let auth_base64 = window.btoa(auth_string)

      // 重要!!! Spotify 的 POST 必須照這個格式寫，改了就不能動，我也不知道為什麼
      let authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        data: qs.stringify({
          code: code,
          redirect_uri: encodeURI(import.meta.env.VITE_REDIRECT_URI),
          grant_type: 'authorization_code'
        }),
        headers: {
          Authorization: 'Basic ' + auth_base64,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      // 此為 axios 語法，用來串 API
      axios(authOptions).then((res) => {
        // 重要!!! 修改管理全域的 @/stores/UserStatus.js 內的 state 資料
        let data = res.data
        this.authCode.access_token = data.access_token
        this.authCode.expires_in = data.expires_in
        this.authCode.refresh_token = data.refresh_token
        this.authCode.scope = data.scope
        this.authCode.token_type = data.token_type
        this.setTokenLocal()
        // Redirect to home page
        this.$router.replace('/')
      })
    },
    // 把 User 的 Token 資料存在本地網頁的 localStorage，下次進來網頁就可以用來判斷是否已經有給授權
    setTokenLocal() {
      localStorage.setItem('authCode', JSON.stringify(this.authCode))
    }
  },
  mounted() {
    this.getTokenURL()
  }
}
</script>
