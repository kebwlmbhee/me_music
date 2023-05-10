import { defineStore } from 'pinia'
import musicQueue from '/src/views/musicQ/musicQueue'
const musicQue = new musicQueue()


export default defineStore('AudioControl ', {
  state: () => {
    return {
      nowChecking: {
        id: '',
        artist: '',
        songName: '',
        url: '',
        picture: '',
        album: {},
        timestamp: '',
      },
      musics: [],
      snackbarMsg: '',
    }
  },
  actions: {
    // 將歌曲加入musicQue
    addQue() {
      let temp = {
        id: this.nowChecking.id,
        artist: this.nowChecking.artist,
        songName: this.nowChecking.songName,
        url: this.nowChecking.url,
        picture: this.nowChecking.picture,
        album: this.nowChecking.album,
        timestamp: Date.now(),
      }
      console.log(temp)
      musicQue.addMusic(temp.id, temp.artist, temp.songName, temp.url, temp.picture, temp.album, temp.timestamp)
    },

    // 更新nowChecking的data
    stateUpdate(data) {
      let temp = {
        id: data.id,
        artist: data.artists[0].name,
        songName: data.name,
        url: data.preview_url,
        picture: data.album.images[0].url,
        album: data.album,
        //timestamp: data.timestamp,
      }
      console.log(temp)
      this.nowChecking = temp
    },
    // 將選擇到的music放到第一首
    switchMusic(index) {
      // 按下 musicQueue 第一首歌時不響應(第一首歌應該正在播放)
      if (index === 0) {
        console.log(`the first music is already playing NOW.`)
        return
      }
      // 取得目標音樂
      const targetMusic = this.musics[index]

      // 取得頂端音樂
      const firstMusic = this.musics[0]

      // 切歌，將變動存至 firebase
      musicQue.replaceMusic(firstMusic, targetMusic)
      
      //console.log('切歌成功')
    },
  }
})