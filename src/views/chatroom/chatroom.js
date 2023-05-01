import { db, ref, push, set, remove, onValue } from '/src/firebaseConf.js'

class Chatroom {
  constructor() {
    this.chatroomRef = ref(db, 'chatroom')
    this.announcementRef = ref(db, 'announcement')
  }

  // 傳送聊天室訊息
  sendMessage(author, text, isAnnounce) {
    // 這裡設置的屬性會傳入 firebase，所以將參數給定 newMessage 的屬性值
    const newMessage = {
      author: author,
      text: text,
      time: Date.now(),
      isAnnounce: isAnnounce
    }
    push(this.chatroomRef, newMessage)
    // 如果 isAnnounce(checkbox)為 true，則寫入公告
    if (isAnnounce) {
      const announcement = push(this.announcementRef)
      const announcementId = announcement.key
      newMessage.id = announcementId
      console.log(newMessage.id)
      set(announcement, newMessage)
    }
  }

  // 偵測聊天室訊息變動，如果有變動，實時更新
  onMessage(callback) {
    onValue(this.chatroomRef, (snapshot) => {
      const messages = []
      snapshot.forEach((childSnapshot) => {
        messages.push(childSnapshot.val())
      })
      if (typeof callback === 'function') {
        callback(messages)
      }
    })
  }

  // 偵測公告變動，如果有變動，實時更新
  onAnnouncement(callback) {
    onValue(this.announcementRef, (snapshot) => {
      const messages = []
      snapshot.forEach((childSnapshot) => {
        messages.push(childSnapshot.val())
      })
      if (typeof callback === 'function') {
        callback(messages)
      }
    })
  }

  // 移除多餘的公告，因為上限 10 筆，如果超過 10 筆，就要調用此 function 移除最舊的公告
  removeAnnouncement(announcement) {
    console.log(announcement)
    console.log(announcement.id)
    remove(ref(db, `/announcement/${announcement.id}`))
  }

  // 將時戳根據電腦的時區換算顯示時間
  getTimeString(timestamp) {
    const date = new Date(timestamp)
    const hour = date.getHours()
    const period = hour >= 12 ? 'PM' : 'AM'
    const adjustedHour = hour % 12 || 12
    const minute = String(date.getMinutes()).padStart(2, '0')
    const second = String(date.getSeconds()).padStart(2, '0')
    const timeString = `${adjustedHour}:${minute}:${second} ${period}`
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')} ${timeString}`
  }
}

export default Chatroom
