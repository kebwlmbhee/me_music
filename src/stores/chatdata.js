import { defineStore } from 'pinia'

import { db } from '../firebaseConf.js'
import Chatroom from '../views/chatroom/chatroom.js'
const chatroom = new Chatroom(db)

export default defineStore('ChatData', {
  state: () => {
    return {
      allMessages: []
    }
  },
  actions: {
    GetChatroomMessages() {
      chatroom.onMessage((messages) => {
        this.allMessages = messages
      })
    },
    AddChatroomMessage(author, text, isAnnounce) {
      if (!author) {
        alert('Please enter your name!')
        return
      }
      if (!text) {
        alert('message is empty!')
        return
      }
      const newMessage = {
        author: author,
        text: text,
        time: Date.now(),
        isAnnounce: isAnnounce
      }
      this.allMessages.push(newMessage)
      chatroom.sendMessage(author, text, isAnnounce)
    }
  }
})
