<template>
  <v-card variant="outlined">
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
        <v-btn icon="mdi-play" @click="clickPlayPreview"> </v-btn>
        <v-btn icon="mdi-plus" @click="AddToMusicQueue"> </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
export default {
  inject: ['PlayPreview'],
  props: {
    Name: String,
    imgSrc: String,
    artist: String,
    id: String,
    type: String,
    preview_url: String
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
      console.log('test')
    }
  }
}
</script>

<style scoped></style>
