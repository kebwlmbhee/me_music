import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useChatDataStore = defineStore('chatdata', () => {
  let ChatData = reactive([])
  function enterChatroom(datas) {
    datas.forEach((data) => {
      this.addNewData(data)
    })
  }
  function addNewData(data) {
    this.ChatData.push(data)
  }
  function ClearChatData() {
    while (this.ChatData.length != 0) {
      this.ChatData.pop()
    }
  }
  return { ChatData, addNewData, ClearChatData, enterChatroom }
})
