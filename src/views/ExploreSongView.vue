<!-- 
  此頁面針對 給予PlayList ID、Album ID 或 Artist ID 
  並且讓此頁面知道Type後 進入
 -->
<template>
  <div v-if="!loaded">
    <!-- Playlist -->
    <v-card v-if="type === 'playlist'" flat border>
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
    <!-- Album -->
    <v-card v-if="type === 'album'" flat border>
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
    <!-- Artist -->
    <v-card v-if="type === 'artist'" flat border>
      <div class="d-flex flex-nowrap flex-row justify-start align-center">
        <v-avatar rounded="0" size="125" class="ma-5">
          <v-img :src="artistData.images[0].url" alt="Not Found"></v-img>
        </v-avatar>
        <div>
          <v-card-item>{{ artistData.type }}</v-card-item>
          <v-card-title class="font-weight-bold text-h4">{{ artistData.name }}</v-card-title>
          <v-card-text>
            {{ artistData.genres.join(',') }}
          </v-card-text>
        </div>
      </div>
    </v-card>
    <!-- ----------------------------------------------------- -->
    <!-- Playlist -->
    <v-list v-if="type == 'playlist'" class="overflow-auto">
      <v-list-item v-for="(item, index) in allData.tracks.items" :key="index">
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
                <v-btn
                  border
                  icon="mdi-play"
                  size="x-small"
                  @click="PlayPreview(item.track.preview_url)"
                ></v-btn>
                <v-btn
                  border
                  icon="mdi-plus"
                  size="x-small"
                  @click="clickOneSong(item.track.id)"
                ></v-btn>
              </v-card-actions>
            </div>
            <v-spacer></v-spacer>
            <div
              v-if="item.track.preview_url == null"
              class="text-red text-center font-weight-bold"
            >
              未提供音樂
            </div>
          </div>
        </v-card>
      </v-list-item>
    </v-list>
    <!-- Album -->
    <v-list v-else-if="type == 'album'" class="overflow-auto">
      <v-list-item v-for="(item, index) in allData.tracks.items" :key="index">
        <v-card flat border>
          <div class="d-flex flex-nowrap flex-row justify-start align-center">
            <v-avatar rounded="0" size="90" class="ma-3">
              <v-img :src="allData.images[0].url" alt="Not Found"></v-img>
            </v-avatar>
            <div>
              <v-card-title class="font-weight-bold">{{ item.name }}</v-card-title>
              <v-card-subtitle>{{ item.artists[0].name }}</v-card-subtitle>
              <v-card-actions>
                <v-btn
                  border
                  icon="mdi-play"
                  size="x-small"
                  @click="PlayPreview(item.preview_url)"
                ></v-btn>
                <v-btn border icon="mdi-plus" size="x-small" @click="clickOneSong(item.id)"></v-btn>
              </v-card-actions>
            </div>
            <v-spacer></v-spacer>
            <div v-if="item.preview_url == null" class="text-red text-center font-weight-bold">
              未提供音樂
            </div>
          </div>
        </v-card>
      </v-list-item>
    </v-list>
    <!-- Artists -->
    <v-list v-else-if="type == 'artist'" class="overflow-auto">
      <v-list-item v-for="(item, index) in allData" :key="index">
        <v-card flat border>
          <div class="d-flex flex-nowrap flex-row justify-start align-center">
            <v-avatar rounded="0" size="90" class="ma-3">
              <v-img :src="item.album.images[0].url" alt="Not Found"></v-img>
            </v-avatar>
            <div>
              <v-card-title class="font-weight-bold">{{ item.name }}</v-card-title>
              <v-card-subtitle>{{ item.artists[0].name }}</v-card-subtitle>
              <v-card-actions>
                <v-btn
                  border
                  icon="mdi-play"
                  size="x-small"
                  @click="PlayPreview(item.preview_url)"
                ></v-btn>
                <v-btn border icon="mdi-plus" size="x-small" @click="clickOneSong(item.id)"></v-btn>
              </v-card-actions>
            </div>
            <v-spacer></v-spacer>
            <div v-if="item.preview_url == null" class="text-red text-center font-weight-bold">
              未提供音樂
            </div>
          </div>
        </v-card>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import axios from 'axios'

export default {
  inject: ['PlayPreview'],
  data() {
    return {
      allData: [],
      artistData: [],
      loaded: false,
      type: ''
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  methods: {
    // TODO : Artist暫時無法做  因為沒辦法取得
    searchTypeRedirect(in_id, type) {
      this.loaded = true
      switch (type) {
        case 'playlist': {
          this.searchPlayListTracks(in_id).then((data) => {
            console.log(data)
            this.allData = data
            this.loaded = false
          })
          break
        }
        case 'artist': {
          const TracksPromise = this.searchArtistTracks(in_id).then((data) => {
            this.allData = data.tracks
          })
          const ArtistPromise = this.searchArtistsData(in_id).then((data) => {
            this.artistData = data
          })
          Promise.all([TracksPromise, ArtistPromise]).then(() => {
            this.loaded = false
          })
          break
        }
        case 'album': {
          this.searchAlbumTracks(in_id).then((data) => {
            this.allData = data
            this.loaded = false
          })
          break
        }
        default: {
          alert('無法進入')
          this.$router.go(1)
          break
        }
      }
    },
    // 搜尋當前要查詢的PlayList
    // TODO 串API ˊ ˇ ˋ
    searchPlayListTracks(id) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/playlists/${id}`,
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
    searchAlbumTracks(id) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/albums/${id}`,
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
    searchArtistTracks(id) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/artists/${id}/top-tracks?market=TW`,
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
    searchArtistsData(id) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/artists/${id}`,
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
    // TODO : 單點歌曲
    clickOneSong(track_id) {
      console.log(`教練 我想點播      id="${track_id}"的歌`)
      // TODO : 點播歌曲
    },
    ...mapActions(UserStatus, ['checkAuth'])
  },
  created() {
    this.checkAuth()
    this.type = this.$route.query.type
    this.searchTypeRedirect(this.$route.query.id, this.type)
  }
}
</script>

<style></style>
