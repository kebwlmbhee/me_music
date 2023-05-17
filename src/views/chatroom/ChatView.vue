<template>
  <div ref="chatMessages" style="height: 100%; overflow: auto">
    <v-list>
      <div
        v-for="(message, index) in this.allMessages"
        :key="index"
        class="text-center"
        id="chat-container"
      >
        <v-label v-if="checkTime(index)">{{ TimeStampToDateString(message.time) }}</v-label>
        <v-list-item>
          <div class="d-flex flex-row flex-nowrap">
            <v-avatar v-if="message.author.avatar" class="mx-2">
              <v-img :src="message.author.avatar"></v-img>
            </v-avatar>
            <v-avatar v-else class="mx-3" color="brown">{{ message.author.name[0] }}</v-avatar>

            <div class="mx-1">
              <v-list-item-subtitle class="text-left">{{
                message.author.name
              }}</v-list-item-subtitle>
              <p class="text-left">{{ message.text }}</p>
              <v-card v-if="message.musicInfo" color="grey">
                <div class="d-flex flex-row flex-nowrap">
                  <v-avatar v-if="message.musicInfo.picture" size="100" rounded="0" class="ma-2">
                    <v-img :src="message.musicInfo.picture"></v-img>
                  </v-avatar>
                  <v-avatar v-else class="mx-3"></v-avatar>

                  <div>
                    <v-card-title>{{ message.musicInfo.songName }}</v-card-title>
                    <v-card-subtitle>{{ message.musicInfo.artist }}</v-card-subtitle>
                    <v-card-actions>
                      <v-btn color="black" @click="PlayPreview(message.musicInfo.url)">Play</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="red" @click="PausePreview">Stop</v-btn>
                      <v-btn @click="AddToQueueButtonCallback(message.musicInfo)">Add</v-btn>
                    </v-card-actions>
                  </div>
                </div>
              </v-card>
            </div>
          </div>
        </v-list-item>
      </div>
    </v-list>
    <!-- 輸入欄 -->
    <v-footer app height="60">
      <v-text-field
        data-test="chatroom-input"
        v-model="text"
        bg-color="grey-lighten-1"
        class="rounded-pill overflow-hidden"
        density="compact"
        hide-details
        variant="solo"
        clearable
        @keydown.enter="SendMessage()"
      ></v-text-field>
      <!-- 公告按鈕 -->
      <v-tooltip text="公告" location="top">
        <template v-slot:activator="{ props }">
          <input
            v-bind="props"
            type="checkbox"
            v-model="isAnnounce"
            style="height: 100%; width: 10%"
          />
        </template>
      </v-tooltip>
      <!-- 是否要傳送當前音樂 -->
      <v-tooltip text="傳送音樂" location="top">
        <template v-slot:activator="{ props }">
          <input
            v-bind="props"
            type="checkbox"
            v-model="isSendMusic"
            style="height: 100%; width: 10%"
          />
        </template>
      </v-tooltip>
      <!-- 滾輪到最底 -->
      <v-btn
        class="ma-2"
        @click="this.ScrollToBottom"
        color="black"
        icon="mdi-wrench"
        style="position: fixed; right: 70px; bottom: 70px"
      >
        <v-icon icon="mdi-arrow-down"></v-icon>
      </v-btn>
    </v-footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'

import Chatroom from './chatroom.js'
const chatroom = new Chatroom()

import AudioControl from '../../stores/AudioControl'

export default {
  inject: ['PlayPreview', 'PausePreview'],
  data() {
    return {
      text: '',
      allMessages: [],
      isAnnounce: false,
      isSendMusic: false
    }
  },
  // props: {
  //   isTesting: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  computed: {
    ...mapState(AudioControl, ['nowChecking']),
    ...mapState(UserStatus, ['userProfile'])
  },
  created() {
    this.chatroom = chatroom
    // 發送時間: messages[].time    發信人: messages[].author  內容: messages[].text
    let CP = new Promise(() => {
      this.chatroom.onMessage((messages) => {
        this.allMessages = messages
      })
    })
    CP
  },
  methods: {
    checkTime(currentIndex) {
      if (currentIndex === 0) return true
      if (
        Math.abs(this.allMessages[currentIndex].time - this.allMessages[currentIndex - 1].time) >
        10 * 60 * 1000
      )
        return true
      else return false
    },
    TimeStampToDateString(timeStamp) {
      return this.chatroom.getTimeString(timeStamp)
    },
    // 發送訊息
    // id_announce : 需要公告到大廳
    // is_sendMusic : 需要發送音樂, 只要公告到大廳就需要發送音樂(?)
    SendMessage() {
      if (!this.text) {
        alert('message is empty!')
        return
      }
      if (this.userProfile.name == '') {
        alert('沒有姓名, 可能需要重新登入')
        return
      }
      if (this.isAnnounce && !this.isSendMusic) {
        alert('如果希望公告, 則請勾選傳送音樂')
        return
      }
      // 判斷是否要傳送音樂
      let currentMusic = null
      if (this.isSendMusic) {
        console.log('要傳送音樂')
        currentMusic = this.nowChecking
        if (this.nowChecking.id == '') {
          alert('並不知你要傳送哪首歌曲')
          return
        }
      }

      // SDJ : add AudioControl nowChecking
      this.chatroom.sendMessage(this.userProfile, this.text, this.isAnnounce, currentMusic)
      this.text = ''
    },
    ScrollToBottom() {
      const chatMessages = this.$refs.chatMessages
      chatMessages.scrollTop = chatMessages.scrollHeight
    },
    AddToQueueButtonCallback(data) {
      this.stateUpdateWithData(
        data.id,
        data.artist,
        data.songName,
        data.url,
        data.picture,
        data.album
      )
      this.addQue()
    },
    ...mapActions(AudioControl, ['addQue', 'stateUpdateWithData'])
  },
  mounted() {
    // setTimeout(() => {
    //   this.ScrollToBottom()
    // }, 1000)

    this.ScrollToBottom()
  }
}
</script>

<style lang="scss" scoped>
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #e2e2e2;
  //border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(133, 133, 133);
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
