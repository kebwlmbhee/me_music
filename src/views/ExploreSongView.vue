<template>
  <div v-if="loaded">
    <v-card flat border>
      <div class="d-flex flex-nowrap flex-row justify-start align-center">
        <v-avatar rounded="0" size="125" class="ma-5">
          <v-img :src="allData.images[0].url" alt="Not Found"></v-img>
        </v-avatar>
        <div>
          <v-card-item>{{ allData.type }}</v-card-item>
          <v-card-title class="font-weight-bold text-h4">{{ allData.name }}</v-card-title>
          <v-card-subtitle>{{ allData.description }}</v-card-subtitle>
        </div>
      </div>
    </v-card>

    <v-list>
      <v-list-item v-for="n in 10" :key="n"> test :{{ n }} </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import UserStatus from '@/stores/UserStatus'

export default {
  data() {
    return {
      allData: [],
      loaded: false
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  methods: {
    searchPlayListTracks() {
      let ID = this.$route.query.id
      let url = `https://api.spotify.com/v1/playlists/${ID}`
      let config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      this.$http.get(url, config).then((res) => {
        this.allData = res.data
        console.log(this.allData)
        this.loaded = true
      })

      //        data.name                                     PlayList名稱
      //        data.description                              PlayList介紹
      //        data.images[]                                 Playlist圖片
      //        data.tracks.items[]                           全部歌
      //                           .track.artists[]           某首歌全部演唱人
      //                                           .name      演唱人名字
      //                           .track.album               專輯
      //                                       .artists[]     專輯的演唱人員
      //                                                 .name同上
      //                                       .images[].url  專輯圖片
      //                                       .name          專輯名稱
      //                                       .release_date  專輯日期
      //                           .name                      歌曲名稱
      //                           .id                        歌曲ID
    }
  },
  created() {
    this.loaded = false
    this.searchPlayListTracks()
  }
}
</script>

<style></style>
