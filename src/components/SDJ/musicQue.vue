<template>
  <div class="base">
    <!-- Queue Title -->
    <div class="queTitle">
      <h1>Music Que</h1>
    </div>
    <!-- Queue List -->
    <div class="queList">
      <v-list>
        <v-list-item v-for="(item, index) in audio.musics" :key="index" :value="item" :height="80" :active="false">
          <div class="d-flex" id="listItem">
            <!-- Music Image -->
            <v-list-item-avatar> <v-img :src="item.picture" :width="50"></v-img></v-list-item-avatar>
            <!-- Music Title -->
            <div class="d-flex flex-column pl-5">
              <v-list-item-title> {{ item.songName }}</v-list-item-title>
              <!-- Music Artist -->
              <v-list-item-subtitle>{{ item.artist }}</v-list-item-subtitle>
              <!-- divider -->
              <v-divider></v-divider>
            </div>
          </div>
          <!-- overlay -->
          <v-overlay activator="parent" class="align-center justify-center" contained scrim="#00ACC1">
            <v-btn variant="flat" @click="switchTrack(index)" :disabled="isDisabled(index)">
              {{ index === 0 ? state.firstText : state.otherText }}
            </v-btn>
          </v-overlay>
        </v-list-item>
      </v-list>
    </div>
    <v-snackbar v-model="state.snackbar" :timeout="-1">
      {{ state.snackbarMsg }}
      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="state.snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
//import { reactive } from 'vue'
import { reactive } from 'vue'
import musicQueue from '/src/views/musicQ/musicQueue.js'
import AudioControl from '../../stores/AudioControl'
const musicQue = new musicQueue()


export default ({
  setup() {
    const audio = reactive( AudioControl() )

    const state = reactive({
      // 控制切歌button
      firstText: '正在播放',
      otherText: '切換到這一首歌',
      switching: false,

      // 控制snackbar顯示
      snackbar: false,
      snackbarMsg: '',
      timeout: 3000,
      timeLeft: 3,
      intervalId: function none() { },
      recentLength: 0,

    })

    
    musicQue.onMusic((musics) => {
      audio.musics = musics

      if (state.recentLength === 0 || state.recentLength < musics.length) {
        state.recentLength = musics.length
      }
      
      if (state.recentLength > musics.length && musics.length != 0) {
        // 將當前長度放到變數recentLength
        state.recentLength = musics.length
        clearInterval(state.intervalId)
        state.switching = true
        //console.log(index)

        state.timeLeft = 3
        
        state.snackbarMsg = `即將播放： ${musics[0].artist} - ${musics[0].songName}   (${state.timeLeft})`
        state.snackbar = true

        state.intervalId = setInterval(() => {
          if (state.timeLeft > 1) {
            state.timeLeft--;
            state.snackbarMsg = `即將播放： ${musics[0].artist} - ${musics[0].songName}   (${state.timeLeft})`
          } else {
            state.switching = false
            state.snackbar = false
            clearInterval(state.intervalId)
          }
        }, 1000)
        
        
      }
    })

    function switchTrack(index) {

      // clearInterval(state.intervalId)

      // state.switching = true
      //console.log(index)
      audio.switchMusic(index)
      // state.timeLeft = 3
      // state.snackbarMsg = `${audio.snackbarMsg}  (${state.timeLeft})`
      // state.snackbar = true

      // state.intervalId = setInterval(() => {
      //   if (state.timeLeft > 1) {
      //     state.timeLeft--;
      //     state.snackbarMsg = `${audio.snackbarMsg}  (${state.timeLeft})`
      //   } else {
      //     state.switching = false
      //     state.snackbar = false
      //     clearInterval(state.intervalId)
      //   }
      // }, 1000)

    }



    function isDisabled(index) {

      // 加入 3 秒cooldown
      // return index === 0 || state.switching
      return index === 0
    }


    /*
    watchEffect(() => {
      setInterval(() => {
        state.snackbarMsg = `${audio.snackbarMsg}  (${state.timeLeft})`
        if(state.timeLeft > 0){
          state.timeLeft--;
        }
      }, 1000)
    })
*/
    //console.log(state)
    return { audio, state, switchTrack, isDisabled }
  },
})

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