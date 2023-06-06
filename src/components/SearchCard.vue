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
        <v-btn icon @click.stop="clickAdd">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="top"> 加入 Music Queue </v-tooltip>
        </v-btn>

        <v-btn border icon size="x-small" @click.stop="PausePreview">
          <v-icon>mdi-pause</v-icon>
          <v-tooltip activator="parent" location="top"> 暫停 Preview </v-tooltip>
        </v-btn>

        <!-- Spotify Web Playback  -->
        <v-btn icon @click.stop="PausePreview" @click="startWebPlayback(id)">
          <v-icon>mdi-access-point</v-icon>
          <v-tooltip activator="parent" location="top"> 在 Spotify 聆聽 </v-tooltip>
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import axios from 'axios'
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
    ...mapState(UserStatus, ['authCode', 'userProfile', 'my_device_id'])
  },
  methods: {
    clickPlayPreview() {
      if (this.type === 'track') {
        if (this.preview_url == null) alert('沒有提供這首歌')
        this.stateUpdateWithData(
          this.id,
          this.artist,
          this.Name,
          this.preview_url,
          this.imgSrc,
          this.album
        )
        this.PlayPreview(this.preview_url)
      } else {
        this.$router.push({
          path: '/Home/ExploreSong',
          query: { id: this.id, type: this.type }
        })
      }
    },
    AddToMusicQueue() {},

    // 連接 Spotify WebPlayback
    startWebPlayback(track_id) {
      let config = {
        method: 'PUT',
        url: 'https://api.spotify.com/v1/me/player/play',
        data: {
          uris: [`spotify:track:${track_id}`]
        },
        params: {
          device_id: this.my_device_id
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      axios(config)
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
