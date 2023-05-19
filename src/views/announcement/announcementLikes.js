import { db, ref, set, get, remove } from '/src/firebaseConf.js'

class AnnouncementLikes {
  constructor() {
    // 取得 announcement 節點的 reference
    this.announcementRef = ref(db, 'announcement')
  }

  async likeButtonForAnnouncement(announcementId, userId) {
    // 取得參考
    const chosenAnnouncementLikesRef = ref(db, `announcement/${announcementId}/likes/${userId}`)

    // 使用 get() 方法獲取數據快照
    const snapshot = await get(chosenAnnouncementLikesRef)

    if (snapshot.exists()) {
      // 如果快照存在數據，則表示已經按過讚，執行移除操作
      await remove(chosenAnnouncementLikesRef)
    } else {
      // 否則，執行加入操作
      await set(chosenAnnouncementLikesRef, true)
    }
  }

  // // 回調函數作為參數
  async getAnnouncementLikes(callback) {
    try {
      // 取得 announcementRef 下的所有公告
      const snapshot = await get(this.announcementRef)
      // 挑出裡面儲存的數據
      const announcements = snapshot.val()
      // 使用 id 遍歷公告資料
      for (const announcementId in announcements) {
        // 取得其 id 下的 likes reference
        const likesRef = ref(db, `announcement/${announcementId}/likes`)
        // 取得 likes ref 下的所有資料
        try {
          const likesSnapshot = await get(likesRef)
          // 挑出裡面儲存的數據
          const likes = likesSnapshot.val()
          // 判定個數，即按讚數
          const likeCount = likes ? Object.keys(likes).length : 0
          // 回傳 callback function
          if (typeof callback === 'function') {
            callback(announcementId, likeCount)
          }
          // 獲取 likes 失敗
        } catch (error) {
          console.error('Error getting likes: ', error)
        }
      }
      // 獲取 announcements 失敗
    } catch (error) {
      console.error('Error getting announcements: ', error)
    }
  }
}

export default AnnouncementLikes
