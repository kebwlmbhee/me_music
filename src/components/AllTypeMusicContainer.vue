<template>
  <div
    class="alltypemusicContainer ma-4 d-flex flex-row flex-wrap justify-space-between overflow-auto"
  >
    <v-card
      v-for="(data, index) in In_Datas"
      :key="index"
      height="10%"
      width="15%"
      flat
      @click="ClickImage(data)"
    >
      <v-img v-if="type == 0" :src="data.album.images[0].url"></v-img>
      <v-img v-else :src="data.images[0].url"></v-img>
      <div class="NameText">
        {{ data.name }}
      </div>
      <v-tooltip activator="parent" location="start">
        {{ data.name }}
      </v-tooltip>
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
          this.Trigger_Popup(true, data)
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
            query: { id: data.id, type: 'album' }
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
