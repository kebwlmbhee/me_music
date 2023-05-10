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
        <v-btn icon="mdi-plus" @click.stop="clickAdd"></v-btn>
        <v-btn icon="mdi-pause" @click.stop="PausePreview"></v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import AudioControl from '@/stores/AudioControl'
export default {
  inject: ['PlayPreview', 'PausePreview'],
  props: {
    Name: String,
    imgSrc: String,
    artist: String,
    id: String,
    type: String,
    preview_url: String,
    album: {}
  },
  computed: {
    ...mapState(UserStatus, ['authCode'])
  },
  methods: {
    clickPlayPreview() {
      if (this.type === 'track') {
        if (this.preview_url == null) alert('沒有提供這首歌')
        this.PlayPreview(this.preview_url)
      } else {
        this.$router.push({
          path: '/Home/ExploreSong',
          query: { id: this.id, type: this.type }
        })
      }
    },
    clickAdd() {
      if (this.preview_url == null) {
        alert('沒有提供這首歌')
        return
      }
      this.stateUpdateWithData(
        this.id,
        this.artist,
        this.Name,
        this.preview_url,
        this.imgSrc,
        this.album
      )
      this.addQue()
    },
    ...mapActions(AudioControl, ['addQue', 'UseTrackIdStateUpdate', 'stateUpdateWithData'])
  }
}
</script>

<style scoped></style>
