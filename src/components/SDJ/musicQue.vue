<template>
  <div class="base">
    <!-- Queue Title -->
    <div class="queTitle">
      <h1>Music Que</h1>
    </div>
    <!-- Queue List -->
    <div class="queList">
      <v-list>
        <v-list-item
          v-for="(item, index) in audio.musics"
          :key="index"
          :value="item"
          :height="80"
          @click.stop
        >
          <!-- Music Image -->
          <template v-slot:prepend>
            <div class="img">
              <v-img :src="item.picture" :width="50"></v-img>
            </div>
          </template>
          <!-- Music Title -->
          <v-list-item-title> {{ item.songName }}</v-list-item-title>
          <!-- Music Artist -->
          <v-list-item-subtitle>{{ item.artist }}</v-list-item-subtitle>
          <!-- divider -->
          <v-divider></v-divider>
          <!-- overlay -->
          <v-overlay activator="parent" contained class="align-center justify-center">
            <v-btn variant="flat" @click="changeTrack">切換到這一首歌</v-btn>
          </v-overlay>
        </v-list-item>
      </v-list>
    </div>
    <v-snackbar v-model="state.snackbar" :timeout="state.timeout">
      {{ state.text }}

      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="state.snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
//import { reactive } from 'vue'
import { reactive } from 'vue'
import musicQueue from '/src/views/musicQ/musicQueue.js'
import AudioControl from '../../stores/AudioControl'

export default {
  setup() {
    const audio = reactive(AudioControl())

    const state = reactive({
      snackbar: false,
      text: 'test',
      timeout: 2000
    })
    const musicQue = new musicQueue()
    musicQue.onMusic((musics) => {
      audio.musics = musics
      //console.log(state.musics)
    })

    function changeTrack() {}

    //console.log(state)
    return { audio, state, changeTrack }
  }
}
</script>

<style lang="scss" scoped>
.base {
  height: 70%;

  .queTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 17%;
    background-color: rgb(223, 223, 223);
  }

  .queList {
    height: 83%;
    overflow: auto;

    .img {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 20px;
    }
  }
}

/* ::-webkit-scrollbar {display:none;} */
.queList::-webkit-scrollbar {
  display: none;
}
</style>
