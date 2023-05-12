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
    // 連接至資料庫指定位置
    // 儲存 musicQueue 位置
    this.musicQueueRef = ref(db, 'musicQueue')
    // 儲存換歌時的訊息
    this.syncSwitchMusicNotificationRef = ref(db, 'syncMusicQueue/switchMusicNotification')
    // 儲存歌曲播放時間
    this.syncMusicPlayTimeStamp = ref(db, 'syncMusicQueue/musicPlayTimeStamp')
  }

  // 在 musicQueue 中加入音樂
  async addMusic(id, artist, songName, url, picture, album, timestamp) {
    // 這裡是為了避免直接 push newMusic 後取不到其 firebase 中的 key

    // 先 push 隨便一個新的東西
    const musicRef = push(this.musicQueueRef)
    // 取得其 key 存在 musicKey
    const musicKey = musicRef.key

    // 定義要存入 firebase 的歌曲
    // 左邊是 newMusic 的 attribute, 右邊是傳入參數/musicKey
    const newMusic = {
      artist: artist,
      songName: songName,
      url: url,
      picture: picture,
      id: id,
      album: album,
      // 設置 musicKey
      key: musicKey,
      // 設置時戳以做刪除判定
      timestamp: timestamp
    }
    // 將 musicRef 裡的內容重設為 newMusic
    // 使用 await 等待 set 完成才返回，結束函數並進行下一步操作
    await set(musicRef, newMusic)
  }

  // 移除指定歌曲，用於使用者點擊刪除按鈕後響應至 firebase
  async removeMusic(music) {
    // 使用 await 等待 remove 完成才返回，結束函數並進行下一步操作
    await remove(ref(db, `/musicQueue/${music.key}`))
  }

  // 移除頂端歌曲，用於歌曲播放完後
  // 使用 transaction，因為這是線上所有人都會同步執行的操作
  async removeMusicTransaction(music) {
    // runTransaction 沒噴 error 時
    try {
      // 使用 await 等待 return musics 後才繼續執行
      // runTransaction 是 firebase 中的函數，返回一個 Promise 對象(未使用)
      // 同時避免多人同時寫入資料庫，當有人寫入時，其它人會被禁止寫入
      // 並具有回滾機制，如果交易失敗，會對已做的更改進行回滾，確保資料正確及完整性
      // runTransaction 失敗時，就會進到 catch 區塊打印錯誤
      // 兩個參數，第一個為指向 musicQueue 的 ref
      //          第二個是 callback function，返回的值直接修改掉 callback function 裡的 musics
      await runTransaction(this.musicQueueRef, (musics) => {
        // 將 musics Object 轉成 entries key-value array
        let entries = Object.entries(musics)

        // 當歌曲 id 相同時(後續大概會改成時戳相同時)
        if (musics[music.key].id === music.id) {
          // 去除 entries 的首位元素
          entries.shift()
          // 將 entries key-value array 轉成 music Object
          musics = Object.fromEntries(entries)
        }
        // 將修改的對象返回並更新 musics
        return musics
      })
    } catch (error) {
      // runTransaction 噴 error 時
      console.error('Fail to remove first Music: ', error)
    }
  }

  // 監聽 musicQueue，保持同步
  onMusic(callback) {
    // onValue 是在該 ref 上掛一個監聽器
    // 資料變動時就會呼叫第二個參數的 callback function 進行更新
    // snapshot 只是變數名稱，想取什麼都行，就是拿到 ref 中的資料指定給該變數
    onValue(this.musicQueueRef, (snapshot) => {
      const musics = []
      // 遍歷子節點，即遍歷 musicQueue 中的所有歌曲
      snapshot.forEach((childSnapshot) => {
        // 只要 val，使用 push 依序加入陣列
        musics.push(childSnapshot.val())
      })
      // 如果 callback 是 function 而不是 null 或 undefined，執行回調函數，將其設回指定的 ref 中
      if (typeof callback === 'function') {
        // 不能使用 return，因為前端會調用 callback 取得資料
        callback(musics)
      }
    })
  }

  // 手動切歌
  // 因為無法在頂端加入新歌，所以用比較 tricky 的方式
  // 可能還會加入時戳判斷
  replaceMusic(firstMusic, targetMusic) {
    // targeMusic(點擊)先存起來
    const toBeRemovedMusic = targetMusic
    // 刪掉 firebase 中的 targetMusic
    this.removeMusic(toBeRemovedMusic)

    // 將 firstMusic 的 key 賦值給 targetMusic
    targetMusic.key = firstMusic.key
    // 替換歌曲
    update(ref(db, `/musicQueue/${firstMusic.key}`), targetMusic)
  }

  // 手動切歌的公告寫入 firebase
  setterSwitchMusicNotification(msg) {
    // syncMusicQueue 中寫入切歌公告
    set(this.syncSwitchMusicNotificationRef, msg)
  }

  // 監聽下一首歌的訊息(切歌時、當前音樂播完，欲播下一首時會調用)，保持所有人資料同步
  onSwitchMusicNotification(callback) {
    // 第一個參數 ref，第二個參數是數據快照
    onValue(this.syncSwitchMusicNotificationRef, (snapshot) => {
      // 同樣只取它的值
      const value = snapshot.val()

      // 如果 callback 是 function 而不是 null 或 undefined，執行回調函數，將其設回指定的 ref 中
      if (typeof callback === 'function') {
        // 前端會調用 callback 取得資料
        callback(value)
      }
    })
  }

  // 歌曲開始播放時都要調用此，參數為 Date.now()
  async setTransactionMusicPlayTime(timestamp) {
    // runTransaction 沒噴錯誤
    try {
      // 使用 await 等待 return currentData 後才繼續執行
      // currentData
      await runTransaction(this.syncMusicPlayTimeStamp, (currentData) => {
        // 如果 currentData 不為 null，且新時戳高於當前時戳 3 秒，更新時戳
        if (!currentData || timestamp - currentData > 3 * 1000) {
          return timestamp
        }
        // 小於等於 3 秒視為延遲，保持原值
        return currentData
      })
    } catch (error) {
      // runTransaction 噴錯誤
      console.error('Failed to update music play timestamp: ', error)
    }
  }

  // 獲取現在播到的時間
  getMusicPlayTime(callback) {
    // 取得資料庫存儲的歌曲播放時間
    get(this.syncMusicPlayTimeStamp)
      .then((snapshot) => {
        // 時戳快照的值存下來
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
