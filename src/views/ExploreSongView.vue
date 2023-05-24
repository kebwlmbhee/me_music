<!-- 
  此頁面針對 給予PlayList ID、Album ID 或 Artist ID 
  並且讓此頁面知道Type後 進入
 -->
<template>
  <div v-if="!loaded">
    <!-- Playlist -->
    <v-card v-if="type === 'playlist'" flat border color="grey-lighten-1">
      <div class="d-flex flex-nowrap flex-row justify-start align-center">
        <v-avatar rounded="0" size="125" class="ma-5">
          <v-img :src="allData.images[0].url" alt="Not Found"></v-img>
        </v-avatar>
        <div class="Title-Container">
          <v-card-item>{{ allData.type }}</v-card-item>
          <v-card-title class="font-weight-bold text-h5">{{ allData.name }}</v-card-title>
          <v-card-text>
            <div class="CardText">
              {{ allData.description }}
            </div>
          </v-card-text>
        </div>
      </div>
    </v-card>
    <!-- Album -->
    <v-card v-if="type === 'album'" flat border color="grey-lighten-1">
      <div class="d-flex flex-nowrap flex-row justify-start align-center">
        <v-avatar rounded="0" size="125" class="ma-5">
          <v-img :src="allData.images[0].url" alt="Not Found"></v-img>
        </v-avatar>
        <div class="Title-Container">
          <v-card-item>{{ allData.type }}</v-card-item>
          <v-card-title class="font-weight-bold text-h4">{{ allData.name }}</v-card-title>
          <v-card-text>
            <div class="CardText">
              {{ allData.description }}
            </div>
          </v-card-text>
        </div>
      </div>
    </v-card>
    <!-- Artist -->
    <v-card v-if="type === 'artist'" flat border color="grey-lighten-1">
      <div class="d-flex flex-nowrap flex-row justify-start align-center">
        <v-avatar rounded="0" size="125" class="ma-5">
          <v-img :src="artistData.images[0].url" alt="Not Found"></v-img>
        </v-avatar>
        <div class="Title-Container">
          <v-card-item>{{ artistData.type }}</v-card-item>
          <v-card-title class="font-weight-bold text-h4">{{ artistData.name }}</v-card-title>
          <v-card-text>
            {{ artistData.genres.join(',') }}
          </v-card-text>
        </div>
      </div>
    </v-card>
    <!-- ----------------------------------------------------- -->
    <div class="d-flex flex-nowrap">
      <!-- Playlist -->
      <v-list
        v-if="type == 'playlist'"
        min-width="50%"
        max-width="100%"
        min-height="300"
        max-height="500"
        class="overflow-auto songList"
      >
        <v-list-item v-for="(item, index) in allData.tracks.items" :key="index">
          <v-card
            flat
            border
            @click="
              clickOneSong(
                item.track.name,
                item.track.id,
                item.track.artists[0].name,
                item.track.album.name,
                item.track.album.images[0].url
              )
            "
            color="grey-lighten-3"
          >
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
                  <v-btn border icon size="x-small" @click.stop="PausePreview">
                    <v-icon>mdi-pause</v-icon>
                    <v-tooltip activator="parent" location="top"> 暫停 Preview </v-tooltip>
                  </v-btn>
                  <!-- Spotify Web Playback  -->
                  <v-btn
                    border
                    icon
                    size="x-small"
                    @click.stop="PausePreview"
                    @click="startWebPlayback(item.track.id)"
                  >
                    <v-icon>mdi-access-point</v-icon>
                    <v-tooltip activator="parent" location="top"> 在 Spotify 聆聽 </v-tooltip>
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
        </v-list-item>
      </v-list>
      <!-- Album -->
      <v-list
        v-else-if="type == 'album'"
        min-width="50%"
        max-width="100%"
        min-height="300"
        max-height="500"
        class="overflow-auto songList"
      >
        <v-list-item v-for="(item, index) in allData.tracks.items" :key="index">
          <v-card
            flat
            border
            @click="
              clickOneSong(
                item.name,
                item.id,
                item.artists[0].name,
                allData.name,
                allData.images[0].url
              )
            "
            color="grey-lighten-3"
          >
            <div class="d-flex flex-nowrap flex-row justify-start align-center">
              <v-avatar rounded="0" size="90" class="ma-3">
                <v-img :src="allData.images[0].url" alt="Not Found"></v-img>
              </v-avatar>
              <div>
                <v-card-title class="font-weight-bold">{{ item.name }}</v-card-title>
                <v-card-subtitle>{{ item.artists[0].name }}</v-card-subtitle>
              </div>
              <v-spacer></v-spacer>
            </div>
          </v-card>
        </v-list-item>
      </v-list>
      <!-- Artists -->
      <v-list
        v-else-if="type == 'artist'"
        min-width="50%"
        max-width="100%"
        min-height="300"
        max-height="500"
        class="overflow-auto songList"
      >
        <v-list-item v-for="(item, index) in allData" :key="index">
          <v-card
            flat
            border
            @click="
              clickOneSong(
                item.name,
                item.id,
                item.artists[0].name,
                item.album.name,
                item.album.images[0].url
              )
            "
            color="grey-lighten-3"
          >
            <div class="d-flex flex-nowrap flex-row justify-start align-center">
              <v-avatar rounded="0" size="90" class="ma-3">
                <v-img :src="item.album.images[0].url" alt="Not Found"></v-img>
              </v-avatar>
              <div>
                <v-card-title class="font-weight-bold">{{ item.name }}</v-card-title>
                <v-card-subtitle>{{ item.artists[0].name }}</v-card-subtitle>
                <v-card-actions>
                  <v-btn border icon size="x-small" @click.stop="PausePreview">
                    <v-icon>mdi-pause</v-icon>
                    <v-tooltip activator="parent" location="top"> 暫停 Preview </v-tooltip>
                  </v-btn>
                  <!-- Spotify Web Playback  -->
                  <v-btn
                    border
                    icon
                    size="x-small"
                    @click.stop="PausePreview"
                    @click="startWebPlayback(item.id)"
                  >
                    <v-icon>mdi-access-point</v-icon>
                    <v-tooltip activator="parent" location="top"> 在 Spotify 聆聽 </v-tooltip>
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
        </v-list-item>
      </v-list>
      <!-- Right -->
      <div
        v-if="OpenSheet"
        class="d-flex flex-column justify-space-around w-50 mx-3 mt-3"
        style="height: 500px; background-color: grey"
      >
        <div class="text-center">
          <v-avatar size="200" rounded="0">
            <v-img :src="currentClickSong.img" />
          </v-avatar>
          <h1>{{ currentClickSong.name }}</h1>
          <h2 class="text-h5">artist:{{ currentClickSong.artist }}</h2>
          <h2 class="text-h5">album:{{ currentClickSong.album_name }}</h2>
        </div>
        <div v-if="noMusic" class="text-red text-center text-h3">未提供音樂</div>
        <div class="text-center">
          <v-btn v-if="!noMusic" size="large" class="mx-5" @click="addQue">Add To Queue</v-btn>
          <v-btn color="error" size="large" class="mx-5" @click="PausePreview">Stop Preview</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import AudioControl from '@/stores/AudioControl'
import axios from 'axios'

export default {
  inject: ['PlayPreview', 'PausePreview'],
  data() {
    return {
      allData: [],
      artistData: [],
      loaded: false,
      OpenSheet: false,
      noMusic: false,
      type: '',
      imgsrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGQDqS3rBb7GyPj87cxlKGJM1VC3CFIaUBg&usqp=CAU',
      currentClickSong: { name: String, artist: String, album_name: String, img: String }
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile', 'my_device_id'])
  },
  methods: {
    // 根據ID, Type 來去查詢需要的資料
    searchTypeRedirect(in_id, type) {
      this.loaded = true
      switch (type) {
        case 'playlist': {
          this.searchPlayListTracks(in_id).then((data) => {
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
    // 搜尋當前要查詢的PlayList的Track
    async searchPlayListTracks(id) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/playlists/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      let return_data = await axios(config)
      return return_data.data
    },
    // 搜尋當前要查詢的Album的Track
    async searchAlbumTracks(id) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/albums/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      let return_data = await axios(config)
      return return_data.data
    },
    // 搜尋當前要查詢的Artist的Track
    async searchArtistTracks(id) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/artists/${id}/top-tracks?market=TW`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      let return_data = await axios(config)
      return return_data.data
    },
    // 搜尋當前要查詢的Artist的資料
    // 因為查Artist本身，不會給予其資料
    async searchArtistsData(id) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/artists/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      let return_data = await axios(config)
      return return_data.data
    },
    // 當點擊某首歌  彈出視窗
    // track_name : 歌曲名稱
    // track_id : 歌曲ID
    // artist_name : 歌曲主唱
    // album_name : 專輯名稱
    // img : 圖片url
    clickOneSong(track_name, track_id, artist_name, album_name, img) {
      this.currentClickSong.name = track_name
      this.currentClickSong.artist = artist_name
      this.currentClickSong.album_name = album_name
      this.currentClickSong.img = img
      this.noMusic = false
      this.UseTrackIdStateUpdate(this.authCode.access_token, track_name, track_id).then((res) => {
        if (res == null) this.noMusic = true
        this.OpenSheet = true
        this.PlayPreview(res)
      })
    },
    // 連接 Spotify WebPlayback
    startWebPlayback(track_id) {
      console.log(this.my_device_id)
      let config = {
        method: 'PUT',
        url: 'https://api.spotify.com/v1/me/player/play',
        data: {
          uris: [`spotify:track:${track_id}`]
        },
        params: {
          device_id: this.my_device_id
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      axios(config).then((res) => {
        console.log(res)
      })
    },
    ...mapActions(UserStatus, ['checkAuth']),
    ...mapActions(AudioControl, ['addQue', 'UseTrackIdStateUpdate'])
  },
  mounted() {
    this.checkAuth()
    this.PausePreview() // 切換頁面時暫停Preview
    this.type = this.$route.query.type // 根據url或去當前type(playlist, album, artist)
    this.searchTypeRedirect(this.$route.query.id, this.type)
  }
}
</script>

<style scoped>
.songList::-webkit-scrollbar {
  display: none;
}
.Title-Container {
  overflow: hidden;
  white-space: wrap;
  text-overflow: ellipsis;
}
.CardText {
  word-break: break-all;
  word-wrap: break-word;
}
</style>
