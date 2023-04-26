<template>
  <div class="ExploreContainer ma-3">
    <h2>熱門播放清單</h2>
    <div class="w-100 d-flex flex-row flex-nowrap overflow-x-auto">
      <div v-for="(item, index) in playlists" :key="index">
        <PlayListCard
          :imgSrc="item.images[0].url"
          :playlistName="item.name"
          @click="clickPlaylist(item.id)"
          :description="item.description"
          :playlistTracks="item.tracks.href"
        />
      </div>
    </div>

    <h2>瀏覽全部</h2>
    <div class="w-100 d-flex flex-row flex-wrap justify-space-evenly overflow-auto">
      <span class="ma-2 text-white text-center" v-for="n in 15" :key="n">
        <v-img :src="imgsrc" alt="Not Found" width="150">
          <div class="bg-primary">
            {{ 'listName' }}
          </div>
        </v-img>
      </span>
    </div>
  </div>
</template>

<script>
import PlayListCard from '../components/PlayListCard.vue'
import { mapState } from 'pinia'
import UserStatus from '@/stores/UserStatus'

export default {
  data() {
    return {
      imgsrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGQDqS3rBb7GyPj87cxlKGJM1VC3CFIaUBg&usqp=CAU',
      playlists: []
    }
  },
  components: {
    PlayListCard
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  methods: {
    clickPlaylist(list_id) {
      this.$router.push({
        path: '/Home/ExploreSong',
        query: { id: list_id }
      })
    },
    searchPlayList() {
      let url = 'https://api.spotify.com/v1/search?query=t&type=playlist&limit=20'
      let config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      this.$http.get(url, config).then((res) => {
        let data = res.data
        this.playlists = data.playlists.items
      })
    }
  },
  mounted() {
    this.searchPlayList()
  }
}
</script>

<style scoped>
.ExploreContainer {
  width: 100%;
  height: 100%;
}
</style>
