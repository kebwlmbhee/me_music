import { db, ref, push, set, remove, onValue } from '/src/firebaseConf.js'

class Chatroom {
  constructor() {
    this.chatroomRef = ref(db, 'chatroom')
    this.announcementRef = ref(db, 'announcement')
  }

  sendMessage(author, text, isAnnounce) {
    const newMessage = {
      author: author,
      text: text,
      time: Date.now(),
      isAnnounce: isAnnounce
    }
    push(this.chatroomRef, newMessage)
    if (isAnnounce) {
      const announcement = push(this.announcementRef)
      const announcementId = announcement.key
      newMessage.id = announcementId
      console.log(newMessage.id)
      set(announcement, newMessage)
    }
  }

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

  removeAnnouncement(announcement) {
    console.log(announcement)
    console.log(announcement.id)
    remove(ref(db, `/announcement/${announcement.id}`))
  }

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