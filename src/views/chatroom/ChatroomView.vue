<template>
  <div class="page-container">
    <div class="chat-container">
      <!-- 如果有訊息才執行 -->
      <div class="messages-container" ref="chatMessages" v-if="messages.length > 0">
        <!-- 給 message 設 index，遍歷它們並打印相關訊息 -->
        <div class="message" v-for="(message, index) in messages" :key="index">
          <div class="message-info">
            <div class="message-author">{{ message.author }}</div>
            <div class="message-time">{{ chatroom.getTimeString(message.time) }}</div>
          </div>
          <div class="message-text">{{ message.text }}</div>
        </div>
      </div>
      <!-- 輸入表單 -->
      <div class="form-container">
        <form class="message-input" @submit.prevent="sendMessage">
          <input type="text" v-model="author" placeholder="Your name" />
          <input type="text" v-model="text" placeholder="Type your message here..." />
          <div class="announce-container">
            <!-- checkbox 判定是否要發送公告 -->
            <div class="announce-label">
              <input type="checkbox" v-model="isAnnounce" id="announcement" />
            </div>
          </div>
          <button type="submit">Send</button>
        </form>
        <!-- 公告按鈕 -->
        <div class="url-redirection">
          <button @click="redirectToUrl">Go to Announcement</button>
        </div>
        <!-- 滾動至底端的按鈕 -->
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
  // created 裡的程式碼都請保留
  created() {
    // 在組件創建時註冊聊天室 Message 的監聽器，如果聊天室訊息變動
    // 則會呼叫 onMessage 將變動寫入 data 裡的 messages 陣列，並顯示在前端
    new Promise((resolve) => {
      chatroom.onMessage((messages) => {
        this.messages = messages
        resolve(this.messages)
      })
    })
  },
  methods: {
    // 點擊 Go to Announcement 按鍵時會開新分頁
    // 前端應該不必保留此 method
    redirectToUrl() {
      window.open('/homepage', '_blank')
    },
    // 滑動到最底端，可以考慮一開始就先讓程式執行此
    // 讓使用者一開始就會在聊天室底端，以查看最新訊息
    // 可以找方法看能不能平滑下移(optional)
    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages
      if (chatMessages) {
        const scrollHeight = chatMessages.scrollHeight
        chatMessages.scrollTop = scrollHeight // 設置 scrollTop 屬性
      }
    },
    // 發送訊息請呼叫此 method，這裡使用 form 表單
    sendMessage() {
      // 可依需求修改，比如 author 為自動獲取 spotify，這行判斷就可刪
      if (!this.author) {
        alert('Please enter your name!')
        return
      }
      // 看要不要讓使用者發送空訊息，不要的話就保留此判斷
      if (!this.text) {
        alert('message is empty!')
        return
      }
      chatroom.sendMessage(this.author, this.text, this.isAnnounce)
      // 最後清除前端的 text，才不會發送後還留著訊息在輸入欄位
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
