<!-- 
  此頁面針對 給予PlayList ID、Album ID 或 Artist ID 
  並且讓此頁面知道Type後 進入
 -->
<template>
  <div v-if="!loaded">
    <v-card flat border>
      <div class="d-flex flex-nowrap flex-row justify-start align-center">
        <v-avatar rounded="0" size="125" class="ma-5">
          <v-img :src="allData.images[0].url" alt="Not Found"></v-img>
        </v-avatar>
        <div>
          <v-card-item>{{ allData.type }}</v-card-item>
          <v-card-title class="font-weight-bold text-h4">{{ allData.name }}</v-card-title>
          <v-card-text>
            {{ allData.description }}
          </v-card-text>
        </div>
      </div>
    </v-card>
    <!-- Playlist -->
    <v-list v-if="type == 'playlist'" class="overflow-auto">
      <v-list-item
        v-for="(item, index) in allData.tracks.items"
        :key="index"
        @click="clickOneSong(item.track.id)"
      >
        <v-card flat border>
          <div class="d-flex flex-nowrap flex-row justify-start align-center">
            <v-avatar rounded="0" size="90" class="ma-3">
              <v-img
                v-if="item.track.album.images.length != 0"
                :src="item.track.album.images[0].url"
                alt="Not Found"
              ></v-img>
            </v-avatar>
            <div>
              <v-card-title class="font-weight-bold">{{ item.track.name }}</v-card-title>
              <v-card-subtitle>{{ item.track.artists[0].name }}</v-card-subtitle>
              <v-card-actions>
                <v-btn border icon="mdi-plus" size="x-small"></v-btn>
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-list-item>
    </v-list>
    <!-- Album -->
    <v-list v-else-if="type == 'album'" class="overflow-auto">
      <v-list-item
        v-for="(item, index) in allData.tracks.items"
        :key="index"
        @click="clickOneSong(item.track.id)"
      >
        <v-card flat border>
          <div class="d-flex flex-nowrap flex-row justify-start align-center">
            <v-avatar rounded="0" size="90" class="ma-3">
              <v-img :src="allData.images[0].url" alt="Not Found"></v-img>
            </v-avatar>
            <div>
              <v-card-title class="font-weight-bold">{{ item.name }}</v-card-title>
              <v-card-subtitle>{{ item.artists[0].name }}</v-card-subtitle>
              <v-card-actions>
                <v-btn border icon="mdi-plus" size="x-small"></v-btn>
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import axios from 'axios'

export default {
  data() {
    return {
      allData: [],
      loaded: false,
      type: ''
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  methods: {
    // TODO : Artist暫時無法做  因為沒辦法取得
    searchTypeRedirect(type) {
      this.loaded = true
      switch (type) {
        case 'playlist':
          this.searchPlayListTracks().then((data) => {
            console.log(data)
            this.allData = data
            this.loaded = false
          })
          break
        case 'artist':
          this.searchArtistTracks().then((data) => {
            this.allData = data
            // this.loaded = false
          })
          break
        case 'album':
          this.searchAlbumTracks().then((data) => {
            console.log(data)
            this.allData = data
            this.loaded = false
          })
          break
        default:
          alert('無法進入')
          this.$router.go(1)
          break
      }
    },
    // 搜尋當前要查詢的PlayList
    // TODO 串API ˊ ˇ ˋ
    searchPlayListTracks() {
      let ID = this.$route.query.id
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/playlists/${ID}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      return new Promise((resolve) => {
        axios(config).then((res) => {
          resolve(res.data)
        })
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
    },
    searchAlbumTracks() {
      let ID = this.$route.query.id
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/albums/${ID}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      return new Promise((resolve) => {
        axios(config).then((res) => {
          resolve(res.data)
        })
      })
    },
    searchArtistTracks() {
      let ID = this.$route.query.id
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/artists/${ID}/albums`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      console.log('artist search')
      return new Promise((resolve) => {
        axios(config).then((res) => {
          resolve(res.data)
        })
      })
    },
    // TODO : 單點歌曲
    clickOneSong(track_id) {
      console.log(`我想點播id="${track_id}"的歌`)
      // TODO : 點播歌曲
    }
  },
  created() {
    this.type = this.$route.query.type
    this.searchTypeRedirect(this.type)
  }
}
</script>

<style></style>
