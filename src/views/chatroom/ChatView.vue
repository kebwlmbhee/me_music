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
          <template v-slot:prepend>
            <v-avatar color="brown">{{ message.author[0] }}</v-avatar>
          </template>
          <v-list-item-subtitle class="text-left">{{ message.author }}</v-list-item-subtitle>
          <v-list-item-title class="text-left">{{ message.text }}</v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
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
        @keydown.enter="SendMessage(this.isAnnounce)"
      ></v-text-field>
      <input type="checkbox" v-model="isAnnounce" style="height: 100%; width: 10%" />
      <v-btn
        class="ma-2"
        @click="this.ScrollToBottom"
        color="black"
        icon="mdi-wrench"
        style="position: fixed; right: 70px; bottom: 70px"
      >
        <v-icon icon="mdi-arrow-down"></v-icon
      ></v-btn>
    </v-footer>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import UserStatus from '@/stores/UserStatus'

import Chatroom from './chatroom.js'
const chatroom = new Chatroom()

import AudioControl from '../../stores/AudioControl'

export default {
  data() {
    return {
      text: '',
      allMessages: [],
      isAnnounce: false
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
    SendMessage() {
      if (!this.text) {
        alert('message is empty!')
        return
      }
      if (this.userProfile.name == '') {
        alert('沒有姓名, 可能需要重新登入')
        return
      }
      const newMessage = {
        author: this.userProfile.name,
        text: this.text,
        isAnnounce: this.isAnnounce
      }
      this.allMessages.push(newMessage)
      // SDJ : add AudioControl nowChecking
      this.chatroom.sendMessage(this.userProfile.name, this.text, this.isAnnounce, this.nowChecking)
      this.text = ''
    },
    ScrollToBottom() {
      const chatMessages = this.$refs.chatMessages
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
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
