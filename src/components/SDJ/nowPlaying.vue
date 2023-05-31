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
            <v-btn flat class="ma-3" @click="PreviewControl">{{ buttonName }}</v-btn>
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
import { ref, reactive, inject, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { MarqueeConstant } from '/src/assets/js/Marquee.js'

export default {
  inject: ['PausePreview', 'PreviewResume'],
  // 現在右下角的圖片
  setup() {
    const state = reactive(AudioControl())
    const { isPreview, nowChecking } = storeToRefs(state)
    const PausePreview = inject('PausePreview')
    const PreviewResume = inject('PreviewResume')
    let buttonName = ref('Resume')

    watch(nowChecking, () => {
      setTimeout(() => {
        const DIV = document.getElementById('LongText')
        const SPAN = document.querySelector('#myText')
        MarqueeConstant(DIV, SPAN)
      }, 100)
    })

    watch(isPreview, (newVal) => {
      buttonName.value = newVal ? 'Stop' : 'Resume'
    })

    function PreviewControl() {
      console.log(isPreview.value)
      if (isPreview.value) {
        // 正在播放 所以取消播放
        console.log('正在播放 我想暫停')
        buttonName.value = 'Resume'
        PausePreview()
      } else {
        // 暫停中 所以繼續播放
        console.log('暫停中 我想繼續')
        buttonName.value = 'Stop'
        PreviewResume()
      }
    }

    return { state, buttonName, PreviewControl }
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
