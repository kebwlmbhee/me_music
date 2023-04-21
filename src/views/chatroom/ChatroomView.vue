<template>
  <div class="page-container">
    <div class="chat-container">
      <div class="messages-container" ref="chatMessages" v-if="messages.length > 0">
        <div class="message" v-for="(message, index) in messages" :key="index">
          <div class="message-info">
            <div class="message-author">{{ message.author }}</div>
            <div class="message-time">{{ chatroom.getTimeString(message.time) }}</div>
          </div>
          <div class="message-text">{{ message.text }}</div>
        </div>
      </div>
      <div class="form-container">
        <form class="message-input" @submit.prevent="sendMessage">
          <input type="text" v-model="author" placeholder="Your name" />
          <input type="text" v-model="text" placeholder="Type your message here..." />
          <div class="announce-container">
            <div class="announce-label">
              <input type="checkbox" v-model="isAnnounce" id="announcement" />
            </div>
          </div>
          <button type="submit">Send</button>
        </form>
        <div class="url-redirection">
          <button @click="redirectToUrl">Go to Announcement</button>
        </div>
        <div class="scroll-to-bottom" @click="scrollToBottom">Scroll to Bottom</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import Chatroom from './chatroom.js'

const chatroom = new Chatroom()

export default defineComponent({
  data() {
    return {
      author: '',
      text: '',
      isAnnounce: false,
      messages: []
    }
  },
  created() {
    new Promise((resolve) => {
      chatroom.onMessage((messages) => {
        this.messages = messages
        resolve(this.messages)
      })
    })
  },
  methods: {
    redirectToUrl() {
      window.open('/homepage', '_blank')
    },
    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages
      if (chatMessages) {
        const scrollHeight = chatMessages.scrollHeight
        chatMessages.scrollTop = scrollHeight // 設置 scrollTop 屬性
      }
    },
    sendMessage() {
      if (!this.author) {
        alert('Please enter your name!')
        return
      }
      if (!this.text) {
        alert('message is empty!')
        return
      }
      chatroom.sendMessage(this.author, this.text, this.isAnnounce)
      this.text = ''
    }
  },
  mounted() {
    this.chatroom = chatroom
  }
})
</script>

<style scope>
.page-container {
  height: 500px;
  position: relative;
}

.chat-container {
  /* 設置內容區域的高度和樣式 */
  height: calc(100% - 50px); /* 減去按鈕區域的高度 */
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f5f5;
}

.announce-container {
  margin-right: 60px;
  height: 80px;
  width: 80px;
  bottom: -30px;
  margin-top: 40px;
}

.announce-description {
  position: relative;
  left: 100px;
}

.announce-label:hover::after {
  content: 'Announce to Homepage';
  position: relative;
  bottom: 80px;
  left: 60px;
  white-space: nowrap;
  background-color: bisque;
  padding: 0.5em;
  border-radius: 0.5em;
  color: red;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* disable scroll */
}

.messages-container {
  height: 100%;
  overflow-y: auto;
}

.message {
  font-size: 30px;
  margin: auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 800px;
}
.message-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.message-author {
  font-weight: bold;
}
.message-time {
  margin-top: auto;
  font-size: 20px;
  color: #666;
}
.message-text {
  white-space: pre-wrap;
}
.message-input {
  display: flex;
  align-items: center;
  margin-top: 30%;
  padding: 10px;
  border-top: 1px solid #ccc;
}
.message-input input {
  width: 150%;
  height: 40px;
  font-size: 1.3rem;
  margin-right: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.message-input button {
  width: 10%;
  height: 45px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
.message-input button:hover {
  background-color: rgb(92, 153, 243);
  color: white;
}
input::placeholder {
  font-size: 20px;
}
.form-container {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.url-redirection {
  position: fixed;
  right: -30%;
  top: 75%;
}

.url-redirection button {
  padding: 10px;
  border-radius: 2px;
  border: none;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin: 0 auto;
}

.url-redirection button:hover {
  background-color: #0056b3;
}

.scroll-to-bottom {
  position: absolute;
  bottom: 80%;
  right: -40%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: #bb9362;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.scroll-to-bottom button:hover {
  background-color: #ab6c2c;
}
</style>
