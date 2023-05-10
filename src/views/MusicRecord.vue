<template>
  <div class="TestContainer">
    <!-- 最上方搜尋按鈕處 -->
    <v-app-bar flat>
      <v-tabs v-model="searchTab" align-tabs="title">
        <v-tab value="歌曲">歌曲</v-tab>
        <v-tab value="歌手">歌手</v-tab>
        <v-tab value="播放清單">播放清單</v-tab>
        <v-tab value="專輯">專輯</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-divider color="black" class="border-opacity-70"></v-divider>
    <!-- Title 跟 排序按鈕處 -->
    <v-card flat class="sortCard">
      <v-card-title class="font-weight-bold text-h3">
        {{ searchTab }}
        <v-icon class="text-h6" color="lightgray">mdi-reload</v-icon>
      </v-card-title>
      <v-card-actions>
        <v-btn>Last Month</v-btn>
        <v-btn>Last 6 Months</v-btn>
        <v-btn>Last Year</v-btn>
        <!-- <v-select label="Sort" variant="underlined" :items="['Test1', 'Test2', 'Test3']"></v-select> -->
      </v-card-actions>
    </v-card>
    <!-- 歌曲裝載處 -->
    <v-window v-if="!loaded" v-model="searchTab">
      <v-window-item value="歌曲">
        <AllTypeMusicContainer :type="0" :In_Datas="searchTracksResponse" />
      </v-window-item>
      <v-window-item value="歌手">
        <AllTypeMusicContainer :type="1" :In_Datas="searchArtistsResponse" />
      </v-window-item>
      <v-window-item value="播放清單">
        <AllTypeMusicContainer :type="2" :In_Datas="searchPlaylistsResponse" />
      </v-window-item>
      <v-window-item value="專輯">
        <AllTypeMusicContainer :type="3" :In_Datas="searchAlbumsResponse" />
      </v-window-item>
    </v-window>
    <!-- 彈出視窗 -->
    <div v-if="popUpWindow" class="TestFooter">
      <v-card class="TestCard" color="white" width="100%" height="100%" border rounded="0">
        <div class="d-flex flex-no-wrap align-center">
          <v-avatar class="ma-3" size="100" rounded="0">
            <v-img :src="checkSong.image"></v-img>
          </v-avatar>
          <div>
            <v-card-title>{{ checkSong.name }}</v-card-title>
            <v-card-subtitle>{{ checkSong.artists[0].name }}</v-card-subtitle>
          </div>
          <v-spacer></v-spacer>
          <!-- 應該要放頭像  但沒有ˊˇˋ -->
          <div style="margin-right: 20px">
            <v-avatar v-for="n in checkSong.artists.length" :key="n">
              <v-img :src="imgSrc"></v-img>
            </v-avatar>
            <!-- 點播按鈕 -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="white" size="small" style="background-color: green" @click="AddNewSong">
                點播
              </v-btn>
            </v-card-actions>
          </div>
          <!-- 關閉按鈕 -->
          <div style="align-self: flex-start">
            <v-icon @click="trigger_pop_up(false)">mdi-chevron-double-down</v-icon>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import UserStatus from '@/stores/UserStatus'
import AudioControl from '@/stores/AudioControl'
import AllTypeMusicContainer from '../components/AllTypeMusicContainer.vue'
import { mapState, mapActions } from 'pinia'
import axios from 'axios'

export default {
  inject: ['PlayPreview', 'PausePreview'],
  data() {
    return {
      loaded: false,
      imgSrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGQDqS3rBb7GyPj87cxlKGJM1VC3CFIaUBg&usqp=CAU',
      searchTab: '',
      searchArtistsResponse: [],
      searchTracksResponse: [],
      searchPlaylistsResponse: [],
      searchAlbumsResponse: [],
      popUpWindow: false,
      popUpHaveUrl: false,
      checkSong: { name: '', image: '', artists: [], mp3_url: '' }
    }
  },
  components: {
    AllTypeMusicContainer
  },
  computed: {
    ...mapState(UserStatus, ['authCode']),
    ...mapState(AudioControl, ['searchPreview'])
  },
  methods: {
    // TODO : 如果 query 是空值  要怎麼辦ㄋ
    searchUserItem() {
      this.loaded = true
      // user tracks
      let config_0 = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/tracks',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      // user artists
      let config_1 = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/following?type=artist',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      // user playlists
      let config_2 = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      // user albums
      let config_3 = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/albums',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }

      const TrackPromise = axios(config_0).then((res) => {
        let data = res.data
        this.searchTracksResponse = data.items
        // console.log(this.searchTracksResponse)
      })
      const ArtistPromise = axios(config_1).then((res) => {
        let data = res.data
        this.searchArtistsResponse = data.artists.items
        // console.log(this.searchArtistsResponse)
      })
      const PlaylistPromise = axios(config_2).then((res) => {
        let data = res.data
        this.searchPlaylistsResponse = data.items
        // console.log(this.searchPlaylistsResponse)
      })
      const AlbumPromise = axios(config_3).then((res) => {
        let data = res.data
        this.searchAlbumsResponse = data.items
        // console.log(this.searchAlbumsResponse)
      })
      Promise.all([AlbumPromise, ArtistPromise, PlaylistPromise, TrackPromise]).then(() => {
        this.loaded = false
      })
    },
    // 觸發彈窗
    trigger_pop_up(up_or_down, data = null) {
      if (!up_or_down) {
        // 不觸發 或是 取消觸發
        // 還要取消Preview 的播歌
        this.popUpWindow = false
        this.PausePreview()
        return
      }

      // 要觸發
      // 還要開始Preview播歌
      this.popUpWindow = true
      this.popUpHaveUrl = false

      this.checkSong = {
        name: data.name,
        image: data.album.images[0].url,
        artists: data.artists
      }
      // 如果沒有 preview url 先用search搜一遍
      // 在確定有沒有
      if (data.preview_url == null) {
        this.UseTrackIdStateUpdate(this.authCode.access_token, data.name, data.id).then((res) => {
          if (res === null) return

          console.log('MusicRecord trigger_pop_up : 沒有Preview Url 但Search的到 Url ')
          this.popUpHaveUrl = true
          this.PlayPreview(res)
        })
      } else {
        console.log('MusicRecord trigger_pop_up : 有Preview Url ')
        this.popUpHaveUrl = true
        this.PlayPreview(data.preview_url)
      }
    },
    // 新增新的歌曲
    AddNewSong() {
      this.addQue()
      this.trigger_pop_up(false)
    },
    ...mapActions(UserStatus, ['checkAuth']),
    ...mapActions(AudioControl, ['addQue', 'UseTrackIdStateUpdate'])
  },
  provide() {
    return {
      Trigger_Popup: this.trigger_pop_up
    }
  },
  created() {
    this.checkAuth()
    this.PausePreview()
    this.searchUserItem()
  }
}
</script>

<style scoped>
.TestContainer {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.directionButton {
  height: 100%;
  margin: 15px 0px 0px 10px;
}

.searchButton {
  margin: 15px 10px 0px 10px;
}

.sortCard {
  margin: 5px 10px;
}

.TestFooter {
  width: 100%;
  height: 140px;
  position: absolute;
  bottom: 0;

  /* border: solid 1px black; */
}

.TestCard {
  margin: 1px;
}
</style>
