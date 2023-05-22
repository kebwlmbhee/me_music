<template>
  <div>
    <v-hover v-slot="{ isHovering, props }">
      <v-card v-bind="props" class="img" border="0">
        <v-img :src="state.nowChecking.picture"></v-img>
        <v-overlay
          :model-value="isHovering"
          contained
          scrim="#036358"
          class="align-center justify-center"
        >
          <div class="d-flex flex-column">
            <v-btn flat class="ma-3" @click="PausePreview">Stop</v-btn>
            <v-btn flat class="ma-3" @click="PreviewResume">Resume</v-btn>
          </div>
        </v-overlay>
      </v-card>
      <div id="LongText">
        <span id="myText" style="display: inline-block">
          {{ state.nowChecking.songName }}
        </span>
      </div>
    </v-hover>
  </div>
</template>

<script>
import AudioControl from '@/stores/AudioControl'
import { reactive, onMounted, nextTick } from 'vue'
import { MarqueeConstant } from '/src/assets/js/Marquee.js'

export default {
  inject: ['PausePreview', 'PreviewResume'],
  // 現在右下角的圖片
  setup() {
    const state = reactive(AudioControl())
    onMounted(() => {
      nextTick(() => {
        const DIV = document.getElementById('LongText')
        const SPAN = document.querySelector('#myText')
        MarqueeConstant(DIV, SPAN)
      })
    })

    return { state }
  }
}
</script>

<style lang="scss" scoped>
#LongText {
  text-align: center;
  font-size: 1em;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.img {
  height: 90%;
  border-top: 1px rgb(222, 222, 222) solid;
}
</style>
