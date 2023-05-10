<template>
  <div v-if="!loaded">
    <!-- 最上方搜尋處 -->
    <v-app-bar scroll-behavior="hide" scroll-threshold="0" flat height="100">
      <v-text-field
        prepend-icon="mdi-magnify"
        v-model="searchText"
        label="Search"
        variant="outlined"
        @click:prepend="searchInputCallback"
        @keydown.enter="searchInputCallback"
      >
      </v-text-field>
      <v-spacer></v-spacer>
    </v-app-bar>
    <!-- 下方搜尋結果 -->
    <v-list>
      <h1>歌曲</h1>
      <v-list-item v-for="(track, index) in searchTracksResponse" :key="index">
        <SearchCard
          :Name="track.name"
          :artist="track.artists.length == 0 ? 'Not Found' : track.artists[0].name"
          :imgSrc="track.album.images[0].url"
          :type="'track'"
          :id="track.id"
          :preview_url="track.preview_url"
          :album="track.album"
        />
      </v-list-item>

      <h1>歌手</h1>
      <v-list-item v-for="(artist, index) in searchArtistsResponse" :key="index">
        <SearchCard
          :Name="artist.name"
          :artist="artist.genres.join(',')"
          :imgSrc="artist.images.length == 0 ? null : artist.images[0].url"
          :type="'artist'"
          :id="artist.id"
        />
      </v-list-item>

      <h1>播放清單</h1>
      <v-list-item v-for="(playlist, index) in searchPlaylistsResponse" :key="index">
        <SearchCard
          :Name="playlist.name"
          :artist="playlist.owner.display_name"
          :imgSrc="playlist.images[0].url"
          :type="'playlist'"
          :id="playlist.id"
        />
      </v-list-item>

      <h1>專輯</h1>
      <v-list-item v-for="(album, index) in searchAlbumsResponse" :key="index">
        <SearchCard
          :Name="album.name"
          :artist="album.artists.length == 0 ? 'Not Found' : album.artists[0].name"
          :imgSrc="album.images[0].url"
          :type="'album'"
          :id="album.id"
        />
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import SearchCard from '../components/SearchCard.vue'
import UserStatus from '@/stores/UserStatus'
import { mapState, mapActions } from 'pinia'
import axios from 'axios'

export default {
  data() {
    return {
      loaded: false,
      searchText: '',
      searchCount: 5,
      searchArtistsResponse: [],
      searchTracksResponse: [],
      searchPlaylistsResponse: [],
      searchAlbumsResponse: []
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode'])
  },
  components: {
    SearchCard
  },
  methods: {
    // TODO : 如果 query 是空值  要怎麼辦ㄋ
    searchItem() {
      this.loaded = true
      // search tracks
      let config_0 = {
        method: 'GET',
        url: `https://api.spotify.com/v1/search?query=${this.searchText}&type=track&limit=${this.searchCount}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      // search artists
      let config_1 = {
        method: 'GET',
        url: `https://api.spotify.com/v1/search?query=${this.searchText}&type=artist&limit=${this.searchCount}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      // search playlists
      let config_2 = {
        method: 'GET',
        url: `https://api.spotify.com/v1/search?query=${this.searchText}&type=playlist&limit=${this.searchCount}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      // search albums
      let config_3 = {
        method: 'GET',
        url: `https://api.spotify.com/v1/search?query=${this.searchText}&type=album&limit=${this.searchCount}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }

      const TrackPromise = axios(config_0).then((res) => {
        let data = res.data
        this.searchTracksResponse = data.tracks.items
        // console.log(this.searchTracksResponse)
      })
      const ArtistPromise = axios(config_1).then((res) => {
        let data = res.data
        this.searchArtistsResponse = data.artists.items
        // console.log(this.searchArtistsResponse)
      })
      const PlaylistPromise = axios(config_2).then((res) => {
        let data = res.data
        this.searchPlaylistsResponse = data.playlists.items
        //   console.log(this.searchPlaylistsResponse)
      })
      const AlbumPromise = axios(config_3).then((res) => {
        let data = res.data
        this.searchAlbumsResponse = data.albums.items
        //   console.log(this.searchAlbumsResponse)
      })
      Promise.all([AlbumPromise, ArtistPromise, PlaylistPromise, TrackPromise]).then(() => {
        this.loaded = false
      })
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
      if (this.searchText == '') {
        alert('搜尋不能為空')
        return
      }
      this.$router.push({
        path: '/Home/Search',
        query: { search: this.searchText }
      })
      this.searchItem(this.searchText, this.searchCount)
    },
    ...mapActions(UserStatus, ['checkAuth'])
  },
  created() {
    this.checkAuth()
    this.PausePreview()
    let query = this.$route.query.search
    this.searchText = query
    if (!query) query = 'a'
    this.searchItem(query, this.searchCount)
  }
}
</script>

<style scoped></style>
