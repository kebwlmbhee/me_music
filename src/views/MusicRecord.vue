<template>
  <div class="TestContainer">
    <!-- 最上方搜尋按鈕處 -->
    <v-app-bar flat>
      <v-tabs v-model="searchTab" align-tabs="title">
        <v-tab value="0">歌曲</v-tab>
        <v-tab value="1">歌手</v-tab>
        <v-tab value="2">播放清單</v-tab>
        <v-tab value="3">專輯</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-divider color="black" class="border-opacity-70"></v-divider>
    <!-- Title 跟 排序按鈕處 -->
    <v-card flat class="sortCard">
      <v-card-title class="font-weight-bold text-h3">
        Title <v-icon class="text-h6" color="lightgray" @click="Reload">mdi-reload</v-icon>
      </v-card-title>
      <v-card-actions>
        <v-btn>Last Month</v-btn>
        <v-btn>Last 6 Months</v-btn>
        <v-btn>Last Year</v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchText"
          label="Search"
          variant="underlined"
          @keydown.enter="searchInputCallback"
        >
        </v-text-field>
        <!-- <v-select label="Sort" variant="underlined" :items="['Test1', 'Test2', 'Test3']"></v-select> -->
      </v-card-actions>
    </v-card>
    <!-- 歌曲裝載處 -->
    <v-window v-if="!loaded" v-model="searchTab">
      <v-window-item value="0">
        <AllTypeMusicContainer :type="0" :In_Datas="searchTracksResponse" />
      </v-window-item>
      <v-window-item value="1">
        <AllTypeMusicContainer :type="1" :In_Datas="searchArtistsResponse" />
      </v-window-item>
      <v-window-item value="2">
        <AllTypeMusicContainer :type="2" :In_Datas="searchPlaylistsResponse" />
      </v-window-item>
      <v-window-item value="3">
        <AllTypeMusicContainer :type="3" :In_Datas="searchAlbumsResponse" />
      </v-window-item>
    </v-window>
    <!-- 彈出視窗 -->
    <div v-if="popUpWindow" class="TestFooter">
      <v-card class="TestCard" color="white" width="100%" height="100%" rounded="0">
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
              <v-btn color="white" size="small" style="background-color: green" @click="AddNewSong"
                >點播</v-btn
              >
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
import AllTypeMusicContainer from '../components/AllTypeMusicContainer.vue'
import { mapState, mapActions } from 'pinia'

export default {
  inject: ['Reload', 'AddMusic', 'PlayPreview', 'PausePreview'],
  data() {
    return {
      loaded: false,
      imgSrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGQDqS3rBb7GyPj87cxlKGJM1VC3CFIaUBg&usqp=CAU',
      searchText: '',
      searchCount: 30,
      searchTab: '',
      searchArtistsResponse: [],
      searchTracksResponse: [],
      searchPlaylistsResponse: [],
      searchAlbumsResponse: [],
      popUpWindow: false,
      checkSong: { name: '', image: '', artists: [], mp3_url: '' }
    }
  },
  components: {
    AllTypeMusicContainer
  },
  computed: {
    ...mapState(UserStatus, ['authCode'])
  },
  methods: {
    // TODO : 如果 query 是空值  要怎麼辦ㄋ
    searchItem(query, limit) {
      this.loaded = true
      let url_0 = `https://api.spotify.com/v1/search/?q=${
        query == '' ? 'a' : query
      }&type=track&limit=${limit}`
      let url_1 = `https://api.spotify.com/v1/search/?q=${
        query == '' ? 'a' : query
      }&type=artist&limit=${limit}`
      let url_2 = `https://api.spotify.com/v1/search/?q=${
        query == '' ? 'a' : query
      }&type=playlist&limit=${limit}`
      let url_3 = `https://api.spotify.com/v1/search/?q=${
        query == '' ? 'a' : query
      }&type=album&limit=${limit}`
      let config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      const TrackPromise = this.$http.get(url_0, config).then((res) => {
        let data = res.data
        this.searchTracksResponse = data.tracks.items
        // console.log(this.searchTracksResponse)
      })
      const ArtistPromise = this.$http.get(url_1, config).then((res) => {
        let data = res.data
        this.searchArtistsResponse = data.artists.items
        // console.log(this.searchArtistsResponse)
      })
      const PlaylistPromise = this.$http.get(url_2, config).then((res) => {
        let data = res.data
        this.searchPlaylistsResponse = data.playlists.items
        // console.log(this.searchPlaylistsResponse)
      })
      const AlbumPromise = this.$http.get(url_3, config).then((res) => {
        let data = res.data
        this.searchAlbumsResponse = data.albums.items
        // console.log(this.searchAlbumsResponse)
      })
      Promise.all([AlbumPromise, ArtistPromise, PlaylistPromise, TrackPromise]).then(() => {
        this.loaded = false
      })
    },
    trigger_pop_up(up_or_down, data = null) {
      // console.log(data) //data.album.images 圖片  data.artists[] 歌手 data.name 名稱
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
      this.checkSong = {
        name: data.name,
        image: data.album.images[0].url,
        artists: data.artists,
        mp3_url: data.preview_url
      }
      this.PlayPreview(this.checkSong.mp3_url)
    },
    // 新增新的歌曲
    // TODO : 串點播API
    AddNewSong() {
      console.log('Add New Song to Start')
      console.log(this.checkSong)
      this.trigger_pop_up(false)
    },
    // 輸入的CallBack
    searchInputCallback() {
      this.$router.push({
        path: '/Home/MusicRecord',
        query: { search: this.searchText }
      })
      this.searchItem(this.searchText, this.searchCount)
    },
    ...mapActions(UserStatus, ['checkAuth'])
  },
  provide() {
    return {
      Trigger_Popup: this.trigger_pop_up
    }
  },
  mounted() {
    this.checkAuth()
    let query = this.$route.query.search
    this.searchText = query
    if (!query) query = 'a'
    this.searchItem(query, this.searchCount)
  }
}
</script>

<style>
.TestContainer {
  width: 100%;
  height: 100%;
  position: relative;
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
  height: 150px;
  position: absolute;
  bottom: 0;

  /* border: solid 1px black; */
}
.TestCard {
  margin: 1px;
}
</style>
