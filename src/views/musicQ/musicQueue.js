import {
  db,
  ref,
  push,
  onValue,
  remove,
  set,
  update,
  runTransaction,
  get
} from '/src/firebaseConf.js'

class musicQueue {
  constructor() {
    this.musicQueueRef = ref(db, 'musicQueue')
    this.syncSwitchMusicNotificationRef = ref(db, 'syncMusicQueue/switchMusicNotification')
    this.syncIsEnded = ref(db, 'syncMusicQueue/isEnded')
    this.syncMusicPlayTimeStamp = ref(db, 'syncMusicQueue/musicPlayTimeStamp')
  }

  async addMusic(id, artist, songName, url, picture, album, timestamp) {
    const musicRef = push(this.musicQueueRef)
    const musicKey = musicRef.key

    const newMusic = {
      artist: artist,
      songName: songName,
      url: url,
      picture: picture,
      id: id,
      album: album,
      key: musicKey,
      timestamp: timestamp
    }
    await set(musicRef, newMusic)
  }

  async removeMusic(music) {
    await remove(ref(db, `/musicQueue/${music.key}`))
  }

  removeMusicTransaction(music) {
    return runTransaction(this.musicQueueRef, (musics) => {
      let entries = Object.entries(musics)

      if (musics[music.key].id === music.id) {
        // 首位
        entries.shift() // 去除首位元素
        musics = Object.fromEntries(entries)
      }
      return musics
    }).catch((error) => {
      console.error('Fail to remove first Music: ', error)
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

  // // 手動切歌
  // replaceMusic(firstMusic, targetMusic) {
  //   targetMusic.key = firstMusic.key
  //   console.log('手動切歌')
  //   console.log(targetMusic.key)
  //   update(ref(db, `/musicQueue/${firstMusic.key}`), targetMusic)
  //   alert(targetMusic.key)
  //   this.removeMusic(targetMusic)
  // }
  // 手動切歌
  replaceMusic(firstMusic, targetMusic) {
    const toBeRemoveMusic = targetMusic
    this.removeMusic(toBeRemoveMusic)
    // 將 firstMusic 的 key 賦值給 targetMusic
    targetMusic.key = firstMusic.key
    // 替換歌曲
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

  // 歌曲開始播放時都要調用此，參數為 Date.now()
  setTransactionMusicPlayTime(timestamp) {
    runTransaction(this.syncMusicPlayTimeStamp, (currentData) => {
      // 如果 currentData 不為 null，且新時戳高於當前時戳 3 秒，更新時戳
      if (!currentData || (timestamp - currentData) / 1000 > 3) {
        return timestamp
      }
      // 否則視為延遲，保持原值
      return currentData
    }).catch((error) => {
      console.error('Failed to update music play timestamp: ', error)
    })
  }

  // 獲取現在播到的時間
  getMusicPlayTime(callback) {
    get(this.syncMusicPlayTimeStamp)
      .then((snapshot) => {
        const musicPlayTimeStamp = snapshot.val()
        // 當前時間 - 歌曲播放的時間  (ms -> s)
        let timestamp = (Date.now() - musicPlayTimeStamp) / 1000
        // 超過 30s -> 0s
        // 如果所有人離線，timestamp 不再寫入時，應該歸零時間
        timestamp = timestamp <= 30.0 ? timestamp : 0
        callback(timestamp)
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export default musicQueue
