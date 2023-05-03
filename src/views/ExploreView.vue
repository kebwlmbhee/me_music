<template>
  <div v-if="!loaded" class="ExploreContainer ma-3">
    <v-text-field
      v-model="search"
      label="Search"
      variant="underlined"
      @keydown.enter="searchCallback"
    >
    </v-text-field>
    <h2>熱門播放清單</h2>
    <div class="w-100 d-flex flex-row flex-nowrap overflow-x-auto">
      <div v-for="(item, index) in playlists" :key="index">
        <PlayListCard
          :imgSrc="item.images[0].url"
          :playlistName="item.name"
          @click="clickPlaylist(item.id, 'playlist')"
          :description="item.description"
          :playlistTracks="item.tracks.href"
        />
      </div>
    </div>

    <h2>推薦電台</h2>
    <div class="w-100 d-flex flex-row flex-nowrap overflow-x-auto">
      <div v-for="(show, index) in shows" :key="index">
        <PlayListCard
          :imgSrc="show.images[0].url"
          :playlistName="show.name"
          @click="clickPlaylist(show.id, 'show')"
          :description="show.description"
        />
      </div>
    </div>

    <h2>推薦藝人</h2>
    <div class="w-100 d-flex flex-row flex-nowrap overflow-x-auto">
      <div v-for="(art, index) in artists" :key="index">
        <PlayListCard
          :imgSrc="art.images[0].url"
          :playlistName="art.name"
          @click="clickPlaylist(art.id, 'artist')"
          :description="art.genres.join(',')"
        />
      </div>
    </div>

    <!-- <h2>瀏覽全部</h2>
    <div class="w-100 d-flex flex-row flex-wrap justify-space-evenly overflow-auto">
      <span class="ma-2 text-white text-center" v-for="n in 15" :key="n">
        <v-img :src="imgsrc" alt="Not Found" width="150">
          <div class="bg-primary">
            {{ 'listName' }}
          </div>
        </v-img>
      </span>
    </div> -->
  </div>
</template>

<script>
import PlayListCard from '../components/PlayListCard.vue'
import { mapState } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import axios from 'axios'

export default {
  data() {
    return {
      loaded: false,
      imgsrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGQDqS3rBb7GyPj87cxlKGJM1VC3CFIaUBg&usqp=CAU',
      playlists: [],
      shows: [],
      artists: [],
      search: ''
    }
  },
  components: {
    PlayListCard
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  methods: {
    // 跑一開始所有的Search
    runSearch() {
      this.loaded = true
      const playlistPromise = this.searchPlayList()
      const showPromise = this.searchShow()
      const artistPromise = this.searchArtist()

      Promise.all([playlistPromise, showPromise, artistPromise]).then(() => {
        this.loaded = false
      })
    },
    clickPlaylist(list_id, type) {
      console.log(type + ', id=' + list_id)
      this.$router.push({
        path: '/Home/ExploreSong',
        query: { id: list_id, type: type }
      })
    },
    searchCallback() {
      this.$router.push({
        path: '/Home/Search',
        query: { search: this.search }
      })
    },
    // 找播放清單
    searchPlayList() {
      let config = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/search?query=t&type=playlist&limit=20',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      return new Promise((resolve) => {
        axios(config).then((res) => {
          this.playlists = res.data.playlists.items
          resolve(true)
        })
      })
    },
    // 找電台?
    searchShow() {
      let config = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/search?query=t&type=show&offset=0&limit=10',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      return new Promise((resolve) => {
        axios(config).then((res) => {
          this.shows = res.data.shows.items
          resolve(true)
        })
      })
    },
    // 找歌手
    searchArtist() {
      let config = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/search?query=c&type=artist&offset=0&limit=10',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      return new Promise((resolve) => {
        axios(config).then((res) => {
          this.artists = res.data.artists.items
          resolve(true)
        })
      })
    }
  },
  mounted() {
    this.runSearch()
  }
}
</script>

<style scoped>
.ExploreContainer {
  width: 100%;
  height: 100%;
}
</style>
