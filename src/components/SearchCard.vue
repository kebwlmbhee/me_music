<template>
  <v-card variant="outlined" @click="clickPlayPreview">
    <div class="d-flex flex-no-wrap justify-start">
      <v-avatar rounded="0" size="72">
        <v-img :src="imgSrc"></v-img>
      </v-avatar>
      <div>
        <v-card-title>{{ Name }}</v-card-title>
        <v-card-subtitle>{{ artist }}</v-card-subtitle>
      </div>
      <v-spacer></v-spacer>
      <div
        v-if="(type === 'track') & (preview_url == null)"
        class="text-red font-weight-bold align-center"
      >
        未提供播放
      </div>
      <v-card-actions v-if="type === 'track'">
        <v-btn icon="mdi-plus" @click.stop="AddMusic(id, artist, Name, preview_url, imgSrc, album)">
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
export default {
  inject: ['PlayPreview', 'AddMusic'],
  props: {
    Name: String,
    imgSrc: String,
    artist: String,
    id: String,
    type: String,
    preview_url: String,
    album: String
  },
  methods: {
    clickPlayPreview() {
      if (this.type === 'track') {
        if (this.preview_url == null) return

        this.PlayPreview(this.preview_url)
      } else {
        this.$router.push({
          path: '/Home/ExploreSong',
          query: { id: this.id, type: this.type }
        })
      }
    },
    AddToMusicQueue() {
      if (this.preview_url == null) return
      // this.AddMusic(this.id, this.artist, this.Name, this.preview_url, this.imgSrc, this.album)
    }
  }
}
</script>

<style scoped></style>
