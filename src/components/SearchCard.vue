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
        <v-btn icon="mdi-plus"></v-btn>
        <!-- @click.stop="AddMusic(id, artist, Name, preview_url, imgSrc, album)" -->
        <v-btn icon="mdi-pause" @click.stop="PausePreview"></v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
export default {
  inject: ['PlayPreview', 'PausePreview'],
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
    }
  }
}
</script>

<style scoped></style>
