<template>
  <div
    class="alltypemusicContainer ma-4 d-flex flex-row flex-wrap justify-space-around overflow-auto"
  >
    <v-card
      v-for="(data, index) in In_Datas"
      :key="index"
      height="10%"
      width="15%"
      flat
      @click="ClickImage(data)"
    >
      <!-- Track 拿其所屬Album的圖片 -->
      <div v-if="type == 0">
        <v-img :src="data.track.album.images[0].url"></v-img>
        <div class="NameText">
          {{ data.track.name }}
        </div>
        <v-tooltip activator="parent" location="start">
          {{ data.track.name }}
        </v-tooltip>
      </div>
      <!-- Artist -->
      <div v-else-if="type == 1">
        <v-img :src="data.images[0].url"></v-img>
        <div class="NameText">
          {{ data.name }}
        </div>
        <v-tooltip activator="parent" location="start">
          {{ data.name }}
        </v-tooltip>
      </div>
      <!-- Playlist -->
      <div v-else-if="type == 2">
        <v-img :src="data.images[0].url"></v-img>
        <div class="NameText">
          {{ data.name }}
        </div>
        <v-tooltip activator="parent" location="start">
          {{ data.name }}
        </v-tooltip>
      </div>
      <!-- Album -->
      <div v-else-if="type == 3">
        <v-img :src="data.album.images[0].url"></v-img>
        <div class="NameText">
          {{ data.album.name }}
        </div>
        <v-tooltip activator="parent" location="start">
          {{ data.album.name }}
        </v-tooltip>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  inject: ['Trigger_Popup'],
  props: {
    In_Datas: Array,
    type: Number
  },
  methods: {
    ClickImage(data) {
      switch (this.type) {
        case 0: //Track
          this.Trigger_Popup(true, data.track)
          break
        case 1: //Artist
          this.$router.push({
            path: '/Home/ExploreSong',
            query: { id: data.id, type: 'artist' }
          })
          break
        case 2: //Playlist
          this.$router.push({
            path: '/Home/ExploreSong',
            query: { id: data.id, type: 'playlist' }
          })
          break
        case 3: //Album
          this.$router.push({
            path: '/Home/ExploreSong',
            query: { id: data.album.id, type: 'album' }
          })
          break
        default:
          alert('there has some error')
          break
      }
    }
  }
}
</script>
<style scoped>
.NameText {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
}
.alltypemusicContainer {
  max-height: 450px;
}
</style>
