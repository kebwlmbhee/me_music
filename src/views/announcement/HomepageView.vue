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

            <!-- 加入按讚的按鈕 -->
            <v-btn
              @click="likesButton(announcement)"
              :class="{ 'bg-green': !announcement.liked, 'liked-button': announcement.liked }"
            >
              <span class="material-symbols-outlined" style="font-size: 1em">thumb_up</span>
              <span style="font-size: 1em; margin-left: 10%">
                <!-- 由 liked 判斷用戶是否已按讚 -->
                <!-- 讚數顯示，若為空，則顯示 0 -->
                {{ announcement.liked ? '已按讚' : '按讚' }}
                {{ announcement.likeCount ? announcement.likeCount : 0 }}
              </span>
            </v-btn>
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
import { mapState } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import Chatroom from '/src/views/chatroom/chatroom.js'
import AnnouncementLikes from '/src/views/announcement/announcementLikes.js'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      // 需留下，儲存公告狀態
      announcements: []
    }
  },
  // created 的程式碼都請保留
  created() {
    this.chatroom = new Chatroom()
    this.announcementLikes = new AnnouncementLikes()
    // 前端 TODO: 請改獲取 userId 傳入
    this.userProfile.id = '456'

    // 在組件創建時註冊公告的監聽器
    // 當公告變更時響應，回傳 messages
    this.chatroom.onAnnouncement((messages) => {
      // 為 announcements 賦值
      this.announcements = messages.map((ParamAnnouncement) => {
        // 確認回傳的型態正確
        if (typeof ParamAnnouncement === 'object') {
          return {
            // 保留 callback 的回傳值
            ...ParamAnnouncement,
            // 加入 likeCount 屬性，僅在本地運行，不會寫入 firebase
            likeCount: 0,
            // 加入 liked 屬性，僅在本地運行，不會寫入 firebase
            liked: false
          }
        }
      })

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
      // 更新讚數/按讚狀態
      this.updateLikes()
    })
  },
  computed: {
    ...mapState(UserStatus, ['userProfile'])
  },
  methods: {
    // 跟 chatroom 的按鍵同理，只是這是開新分頁跳轉至聊天室
    // 前端應該不必保留此 method
    redirectToUrl() {
      window.open('/chatroom', '_blank')
    },
    // 點擊"按讚"按鈕
    async likesButton(announcement) {
      try {
        // userProfile.id 為空時會出錯，若獲取不到 userId 時，應該 alert 後 return
        if (!this.userProfile.id) {
          alert('請重新登入')
          return
        }
        // 點擊讚後的響應會由後端進行判斷
        // 若為已按讚的狀態下會取消，未按讚的狀況下會新增
        await this.announcementLikes.likeButtonForAnnouncement(announcement.id, this.userProfile.id)
      } catch (error) {
        // 按鈕的意外錯誤
        console.error(error)
      }
    },
    updateLikes() {
      // 更新每個公告的按讚數量，回調參數為公告 id 和按讚數
      this.announcementLikes.getAnnouncementLikes((announcementId, likeCount) => {
        // 尋找遍歷到的 id
        const targetAnnouncement = this.announcements.find(
          (announcement) => announcement.id === announcementId
        )
        if (targetAnnouncement) {
          // 更新指定公告的讚數
          targetAnnouncement.likeCount = likeCount

          // 檢查是否按過讚
          const userId = this.userProfile.id
          // 如果 "該 userId 存在"
          // 且 "該 announcement 下的 likes 路徑存在"
          // 且 "該 userId 存在於該 announcement 的 likes 路徑中"
          if (userId && targetAnnouncement.likes && targetAnnouncement.likes[userId]) {
            // 標記為已按讚
            targetAnnouncement.liked = true
          }
        }
      })
    }
  }
})
</script>

<style scoped>
/* 已按讚時的樣式 */
.liked-button {
  background-color: gray;
}

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
