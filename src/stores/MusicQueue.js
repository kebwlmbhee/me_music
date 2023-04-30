import { defineStore } from 'pinia'

export default defineStore('MusicQueue', {
  state: () => {
    return {
      musicQueue: []
    }
  },
  actions: {
    GetTheQueue() {
      //獲取  Music Play Queue
      // console.log("GetTheQueue")
      return this.musicQueue
    },
    ShiftTheMusic() {
      // console.log("ShiftTheMusic")
      return this.musicQueue.shift()
    },
    AddMusicToTheQueue(data) {
      // TODO : 判斷data格式是否一樣
      // 如果不同則Alert或直接報錯
      // console.log("AddMusicToTheQueue")
      this.musicQueue.push(data)
    },
    AddMusicToTheQueue_2(name, singer_name_for_one, image_url, mp3_url) {
      // console.log("AddMusicToTheQueue_2")
      // console.log(`name =${name}, singer =${singer_name_for_one}\n,image = ${image_url}\nmp3 = ${mp3_url}`)
      this.musicQueue.push({
        Name: name,
        singer: singer_name_for_one,
        image: image_url,
        mp3: mp3_url
      })
    }
  }
})
