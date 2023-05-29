import { defineStore } from 'pinia'
import musicQueue from '/src/views/musicQ/musicQueue'
import axios from 'axios'
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
        timestamp: ''
      },
      musics: [],
      snackbarMsg: '',
      searchPreview: '',
      isPreview: false
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
        timestamp: Date.now()
      }
      console.log(temp)
      musicQue.addMusic(
        temp.id,
        temp.artist,
        temp.songName,
        temp.url,
        temp.picture,
        temp.album,
        temp.timestamp
      )
    },
    // 更新nowChecking的data
    stateUpdate(data) {
      let temp = {
        id: data.id,
        artist: data.artists[0].name,
        songName: data.name,
        url: data.preview_url,
        picture: data.album.images[0].url,
        album: data.album
        //timestamp: data.timestamp,
      }
      // console.log(temp)
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
      this.snackbarMsg = `即將播放： ${this.musics[0].artist} - ${this.musics[0].songName}`
      console.log('切歌成功')
    },
    async UseTrackIdStateUpdate(access_token, name, id) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/search/?q=${name}&type=track&limit=5`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      }
      this.searchPreview = null
      let Axios_data = await axios(config)
      let data = Axios_data.data.tracks.items

      for (var i = 0; i < 5; i++) {
        if (data[i].id == id && data[i].preview_url != null) {
          this.stateUpdate(data[i])
          this.searchPreview = data[i].preview_url
          return data[i].preview_url
        }
      }
      return null
    },
    stateUpdateWithData(id, artist, songname, preview_url, image, album) {
      let temp = {
        id: id,
        artist: artist,
        songName: songname,
        url: preview_url,
        picture: image,
        album: album
      }
      // console.log(temp)
      this.nowChecking = temp
    },
    isPreviewStateChange(isPlaying) {
      console.log(`current this.isPreview = ${this.isPreview} , isPlaying = ${isPlaying}`)
      this.isPreview = isPlaying
    }
  }
})
