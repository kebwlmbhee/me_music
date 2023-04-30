<!-- 這頁是範例 example，麻煩每次創建新的 View 時都按照以下格式，才能成功串接 API -->
<template>
  <div>這頁是範例 example</div>
  <br />
  <div>
    <h3>GET 範例</h3>
    <p>{{ getArtist_data }}</p>
  </div>
  <br />
  <div>
    <h3>POST 範例，會在你的 Spotify Queue 加入一首歌</h3>
    <v-btn v-on:click="addQueue">addQueue</v-btn>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import axios from 'axios'

export default {
  data() {
    return {
      getArtist_data: ''
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  methods: {
    ...mapActions(UserStatus, ['checkAuth', 'logout']),
    // 如果 API 要用 Get
    // 範例，假設要串這個: https://developer.spotify.com/documentation/web-api/reference/get-an-artist
    getArtist() {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      axios(config).then((res) => {
        let data = res.data
        this.getArtist_data = data
      })
    },

    // 如果 API 要用 POST, 麻煩用這個格式
    // 範例: https://developer.spotify.com/documentation/web-api/reference/add-to-queue
    addQueue() {
      let config = {
        method: 'POST',
        url: 'https://api.spotify.com/v1/me/player/queue/?uri=spotify:track:3KkXRkHbMCARz0aVfEt68P',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      axios(config).then((res) => {
        console.log(res)
      })
    }
  },
  mounted() {
    // 每一頁都要代入 checkAuth()
    this.checkAuth()
    this.getArtist()
  }
}
</script>
