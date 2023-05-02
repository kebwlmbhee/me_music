<template>
  <div>
    <h1>Announcements:</h1>
    <!-- 如果公告數量 > 0，判定有無公告，如果沒有公告，就不繼續執行 -->
    <div class="announcement-container" v-if="announcements.length > 0">
      <!-- 以 id 進行遍歷，以利後續打印訊息至前端網頁 -->
      <!-- id 是存在 firebase，所以以 id 遍歷不用改，前端可直接拿來套 -->
      <div v-for="announcement in announcements" :key="announcement.id">
        <ul>
          <li>
            <!-- 打印相關訊息 -->
            <div class="announcement-author">Author: {{ announcement.author }}</div>
            <div class="announcement-text">Content: {{ announcement.text }}</div>
            <div class="announcement-time">
              Time: {{ chatroom.getTimeString(announcement.time) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 聊天室按鈕 -->
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
      announcements: []
    }
  },
  // created 的程式碼都請保留
  created() {
    this.chatroom = new Chatroom()

    // 在組件創建時註冊公告 Message 的監聽器
    this.chatroom.onAnnouncement((messages) => {
      this.announcements = messages
      // 公告依據時戳進行排序，新的優先顯示
      this.announcements.sort((a, b) => b.time - a.time)
      // 保持最多 10 筆公告
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
    // 跟 chatroom 的按鍵同理，只是這是開新分頁跳轉至聊天室
    // 前端應該不必保留此 method
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
