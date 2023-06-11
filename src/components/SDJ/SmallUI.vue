<!-- eslint-disable max-len -->
<template>
  <div class="outer">
    <div class="image">
      <img :src="imageRef" alt="test" style="width: 100%; max-height: 100%" />
      <v-btn id="play" size="30" class="bg-green" icon="true">
        <v-icon class="text-black">
          <span class="material-symbols-outlined" style="font-size: 30px">arrow_right</span>
        </v-icon>
      </v-btn>
      <div class="text">{{ peopleNum }}</div>
    </div>

    <div id="text">
      <div id="song">
        <span style="font-size: 1em">{{ songName }}</span
        ><br />
        <span style="font-size: 0.8em">{{ singerName }}</span>
      </div>
      <span id="ID">{{ `${this.roomID} + ${roomName}` }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outer {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  aspect-ratio: 3/4;

  background-color: #adadad;
  // border: 2px solid;
  // border-radius: 5px;
  padding: 5px;
  margin-top: 0px;
  margin-left: 10px;
  .image {
    position: relative;
    display: flex;
    width: 100%;
    height: 50%;
    background-color: blue;
    #play {
      position: absolute;
      z-index: 1;
      right: 0px;
      bottom: 0px;
    }
    .text {
      position: absolute;
      right: 0px;
      top: 0px;
      width: 30px;
      height: 20px;
      border: 1px solid;
      font-size: 0.5em;
      text-align: center;
    }
  }

  #text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 50%;
    width: 100%;
    #song {
    }

    #ID {
      // position: absolute;
      bottom: 0;
      text-align: center;
      width: auto;
      border: 1px solid;
      border-radius: 1px;
    }
  }
}
</style>

<script lang="ts">
export default {
  props: {
    peopleNum: {
      type: String,
      default: 'none'
    },
    imageRef: {
      type: String,
      default: 'https://i.imgur.com/pJziasF.jpeg'
    },
    isPlay: {
      type: String,
      default: 'none'
    },
    songName: {
      type: String,
      default: 'none'
    },
    singerName: {
      type: String,
      default: 'none'
    },
    roomID: {
      type: String,
      default: 'none'
    },
    roomName: {
      type: String,
      default: 'none'
    }
  }
}
</script>
