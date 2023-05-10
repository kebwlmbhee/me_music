<template>
  <v-app>
    <v-list>
      <div v-for="(message, index) in this.allMessages" :key="index" class="text-center">
        <v-label v-if="checkTime(index)">{{ TimeStampToDateString(message.time) }}</v-label>
        <v-list-item>
          <template v-slot:prepend v-if="message.author">
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
  </v-app>
</template>

<script>
import { mapState } from 'pinia'
import UserStatus from '@/stores/UserStatus'

import Chatroom from './chatroom.js'
const chatroom = new Chatroom()

export default {
  name: 'ChatRoom',
  data() {
    return {
      currentTime: Date,
      text: '',
      allMessages: []
    }
  },
  computed: {
    ...mapState(UserStatus, ['userProfile'])
  },
  created() {
    // 發送時間: messages[].time    發信人: messages[].author  內容: messages[].text
    chatroom.onMessage((messages) => {
      this.allMessages = messages
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
      return chatroom.getTimeString(timeStamp)
    },
    SendMessage(isAnnounce = false) {
      if (!this.text) {
        alert('message is empty!')
        return
      }
      const newMessage = {
        author: this.userProfile.name,
        text: this.text,
        isAnnounce: isAnnounce
      }
      this.allMessages.push(newMessage)
      chatroom.sendMessage(this.userProfile.name, this.text, isAnnounce)
      this.text = ''
    }
  },
  mounted() {
    this.chatroom = chatroom
  }
}
</script>

<style></style>
