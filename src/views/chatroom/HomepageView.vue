<template>
  <div>
    <h1>Announcements:</h1>
    <div class="announcement-container" v-if="announcements.length > 0">
      <div v-for="announcement in announcements" :key="announcement.id">
        <ul>
          <li>
            <div class="announcement-author">Author: {{ announcement.author }}</div>
            <div class="announcement-text">Content: {{ announcement.text }}</div>
            <div class="announcement-time">
              Time: {{ chatroom.getTimeString(announcement.time) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="url-redirection">
      <button @click="redirectToUrl">Go to Chatroom</button>
    </div>
  </div>
</template>

<script>
import Chatroom from '/src/views/chatroom/chatroom.js'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      announcements: [],
      keys: []
    }
  },
  created() {
    this.chatroom = new Chatroom()
    this.chatroom.onAnnouncement((messages) => {
      // // sort by timestamp
      // messages.sort((a, b) => b.time - a.time)
      // // keep the lastest 10 announcements
      // while (messages.length > 10) {
      //   messages.pop()
      // }
      // resolve(this.announcements)
      this.announcements = messages
      // sort by timestamp
      this.announcements.sort((a, b) => b.time - a.time)
      // keep the lastest 10 announcements
      while (this.announcements.length > 10) {
        // 獲取最後一個元素
        const announcement = this.announcements[this.announcements.length - 1]
        // 刪除最後一個元素(Website)
        this.announcements.pop()
        // 刪除最後一個元素(Firebase)
        this.chatroom.removeAnnouncement(announcement)
      }
    })
  },
  methods: {
    redirectToUrl() {
      window.open('/chatroom', '_blank')
    }
  }
})
</script>

<style scoped>
.announcement-container {
  position: fixed;
  bottom: 20;
  left: 50%;
  width: 150%;
  height: 65%;
  transform: translateX(-50%);
  overflow-y: scroll;
}

html,
body {
  overflow: hidden;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  margin: 0 auto;
  max-width: 50%;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  padding: 1rem;
}

.announcement-author {
  font-weight: bold;
  font-size: 16px;
}

.announcement-time {
  font-size: 16px;
  color: #999;
  align-self: flex-end;
}

.announcement-text {
  font-size: 20px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.url-redirection {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.url-redirection button {
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #bb9362;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.url-redirection button:hover {
  background-color: #ab6c2c;
}
</style>
