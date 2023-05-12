<template>
  <v-app v-if="isTesting" />

  <div v-if="!isTesting">
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
        @keydown.enter="SendMessage"
      ></v-text-field>
    </v-footer>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import UserStatus from '@/stores/UserStatus'

import Chatroom from './chatroom.js'
const chatroom = new Chatroom()

export default {
  data() {
    return {
      text: '',
      allMessages: []
    }
  },
  props: {
    isTesting: {
      type: Boolean,
      default: false
    }
  },
  computed: {
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
    CP.then(() => {
      setTimeout(() => {
        this.ScrollToBottom()
      }, 300)
    })
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
    SendMessage(isAnnounce = false) {
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
        isAnnounce: isAnnounce
      }
      this.allMessages.push(newMessage)
      this.chatroom.sendMessage(this.userProfile.name, this.text, isAnnounce)
      this.text = ''
    },
    ScrollToBottom() {
      var container = document.getElementById('chat-container')
      if (container == null) return
      container.scrollTop = container.scrollHeight
    }
  }
}
</script>

<style></style>
