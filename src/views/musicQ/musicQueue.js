import { db, ref, push, onValue, remove, set, update } from '/src/firebaseConf.js'

class musicQueue {
  constructor() {
    this.musicQueueRef = ref(db, 'musicQueue')
    this.syncIsCuttingRef = ref(db, 'syncMusicQueue/isCutting')
    this.syncCuttingMessageRef = ref(db, 'syncMusicQueue/cutMusicMessage')
    this.syncUpcomingMusicRef = ref(db, 'syncMusicQueue/upcomingMusic')
  }

  async addMusic(artist, songName, url) {
    const musicRef = push(this.musicQueueRef)
    const musicKey = musicRef.key

    const newMusic = {
      artist: artist,
      songName: songName,
      url: url,
      key: musicKey
    }
    await set(musicRef, newMusic)
  }

  removeMusic(music) {
    remove(ref(db, `/musicQueue/${music.key}`)).catch((error) => console.error(error))
  }

  // 監聽 musicQueue，保持同步
  onMusic(callback) {
    onValue(this.musicQueueRef, (snapshot) => {
      const musics = []
      snapshot.forEach((childSnapshot) => {
        musics.push(childSnapshot.val())
      })
      if (typeof callback === 'function') {
        callback(musics)
      }
    })
  }

  // 手動切歌
  replaceMusic(firstMusic, targetMusic) {
    this.removeMusic(targetMusic)
    targetMusic.key = firstMusic.key
    update(ref(db, `/musicQueue/${firstMusic.key}`), targetMusic)
  }

  // 正在切歌/取消切歌
  setCutting(isCutting) {
    set(this.syncIsCuttingRef, isCutting)
  }

  // 監聽是否在切歌中，保持同步
  onCutting(callback) {
    onValue(this.syncIsCuttingRef, (snapshot) => {
      const isCutting = snapshot.val()

      if (typeof callback === 'function') {
        callback(isCutting)
      }
    })
  }

  // 手動切歌的公告寫入 firebase(TODO: 彈窗顯示)
  setterCutMusicMessage(msg) {
    set(this.syncCuttingMessageRef, msg)
  }

  // 監聽切歌訊息(切歌中時會調用)，保持同步
  onCuttingMessage(callback) {
    onValue(this.syncCuttingMessageRef, (snapshot) => {
      const cuttingMessage = snapshot.val()

      if (typeof callback === 'function') {
        callback(cuttingMessage)
      }
    })
  }

  setUpcomingMusic(upcomingMusic) {
    set(this.syncUpcomingMusicRef, upcomingMusic)
  }

  onUpcomingMusic(callback) {
    onValue(this.syncUpcomingMusicRef, (snapshot) => {
      const upcomingMusic = snapshot.val()

      if (typeof callback === 'function') {
        callback(upcomingMusic)
      }
    })
  }
}

export default musicQueue
