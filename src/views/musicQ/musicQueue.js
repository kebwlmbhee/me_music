import { db, ref, push, onValue, remove, set, update, runTransaction } from '/src/firebaseConf.js'

class musicQueue {
  constructor() {
    this.musicQueueRef = ref(db, 'musicQueue')
    this.syncSwitchMusicNotificationRef = ref(db, 'syncMusicQueue/switchMusicNotification')
    this.syncIsEnded = ref(db, 'syncMusicQueue/isEnded')
  }

  async addMusic(id, artist, songName, url, picture, album) {
    const musicRef = push(this.musicQueueRef)
    const musicKey = musicRef.key

    const newMusic = {
      artist: artist,
      songName: songName,
      url: url,
      picture: picture,
      id: id,
      album: album,
      key: musicKey
    }
    await set(musicRef, newMusic)
  }

  removeMusic(music) {
    remove(ref(db, `/musicQueue/${music.key}`)).catch((error) => console.error(error))
  }

  removeMusicTransaction(music) {
    const musicRef = ref(db, '/musicQueue')
    return runTransaction(musicRef, (currentData) => {
      if (currentData === null) {
        return currentData
      }

      const musicQueue = Object.values(currentData)

      if (musicQueue.length === 0) {
        return currentData
      }

      const newMusicQueue = musicQueue.filter((m) => m.key !== music.key)

      return newMusicQueue.reduce((data, music, index) => {
        data[index] = music
        return data
      }, {})
    }).catch((error) => {
      console.error('Error removing music:', error)
      throw error
    })
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

  onMusicTop() {
    // 监听 musicQueueRef 路径下的子节点变化
    this.musicQueueRef.on('child_changed', (snapshot) => {
      // 获取第一个子节点的值
      const firstChild = snapshot.val()[Object.keys(snapshot.val())[0]]
      console.log('MusicQueueTop：', firstChild)
    })
  }

  // 手動切歌
  replaceMusic(firstMusic, targetMusic) {
    this.removeMusic(targetMusic)
    targetMusic.key = firstMusic.key
    update(ref(db, `/musicQueue/${firstMusic.key}`), targetMusic)
  }

  // 手動切歌的公告寫入 firebase(TODO: 彈窗顯示)
  setterSwitchMusicNotification(msg) {
    set(this.syncSwitchMusicNotificationRef, msg)
  }

  // 監聽下一首歌的訊息(切歌中時會調用、當前音樂播放完畢，欲播下一首時會調用)，保持同步
  onSwitchMusicNotification(callback) {
    onValue(this.syncSwitchMusicNotificationRef, (snapshot) => {
      const value = snapshot.val()

      if (typeof callback === 'function') {
        callback(value)
      }
    })
  }
}

export default musicQueue
