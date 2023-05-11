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
        <v-btn icon @click="clickPlayPreview">
          <v-icon>mdi-play</v-icon>
          <v-tooltip activator="parent" location="top"> 在本地試聽 </v-tooltip>
        </v-btn>

        <v-btn icon @click="AddToMusicQueue">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="top"> 加入 Music Queue </v-tooltip>
        </v-btn>

        <!-- Spotify Web Playback  -->
        <v-btn icon @click="startWebPlayback(id)">
          <v-icon>mdi-access-point</v-icon>
          <v-tooltip activator="parent" location="top"> 在 Spotify 聆聽 </v-tooltip>
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import { mapState } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import axios from 'axios'

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
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile', 'my_device_id'])
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
    },

    // 連接 Spotify WebPlayback
    startWebPlayback(track_id) {
      console.log(this.my_device_id)
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
      axios(config).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped></style>
