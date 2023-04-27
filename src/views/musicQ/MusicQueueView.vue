<template>
  <div class="music-queue">
    <h1 class="title">Music Queue</h1>
    <ul class="music-list" v-if="musics.length > 0">
      <li class="music-item" v-for="music in musics" :key="music.key">
        <div class="music-info">
          <div class="music-artist">Artist: {{ music.artist }}</div>
          <div class="music-song">Song: {{ music.songName }}</div>
          <span
            >URL:
            <a
              class="music-url"
              :href="music.url"
              target="_blank"
              @click="openMusicUrl(music.url)"
              >{{ music.url }}</a
            ></span
          >
        </div>
        <button @click="cutMusic(music)" class="play-music-btn">Play</button>
        <button @click="deleteMusic(music)" class="delete-music-btn">Delete</button>
      </li>
    </ul>
    <div class="form-divider"></div>
    <!-- 分隔線 -->
    <form class="add-music-form" @submit.prevent="addMusic">
      <input v-model="artist" type="text" placeholder="Artist" class="input-field" />
      <input v-model="songName" type="text" placeholder="Song Name" class="input-field" />
      <input v-model="url" type="text" placeholder="Type URL" class="input-field" />
      <button type="submit" class="add-music-btn">Add Music</button>
    </form>
  </div>
  <div>
    <transition name="fade" mode="out-in">
      <!-- 如果 showMessage 為 true，顯示訊息 -->
      <div v-if="showMessage" key="message" class="message">
        {{ delayedMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
// TODO(前端): 切歌時的公告要使用彈出式視窗呈現
// TODO: 如果A切歌途中偵測到另一人切歌(B)時的處置方式，
//       是需要當前的切歌被迫取消，改為B的切歌？ => 需要監聽另一個值判斷當前切歌與否
import musicQueue from '/src/views/musicQ/musicQueue.js'

// 延遲 5 秒(顯示切歌訊息)
const timeDelaySecond = 5

export default {
  data() {
    return {
      isEnd: false,
      isPause: false,
      isPlay: true,
      upcomingMusic: '',
      showMessage: false,
      delayedMessage: '',

      artist: '',
      songName: '',
      url: '',
      musics: []
    }
  },
  created() {
    // 在組件創建時註冊 MusicQueue 的監聽器
    // 實時獲取 musicQueue 資料
    this.musicQueue = new musicQueue()
    this.musicQueue.onMusic((musics) => {
      this.musics = musics
    })

    // 實時獲取 showMessage 的 boolean value
    this.musicQueue.onCutting((isCutting) => {
      this.showMessage = isCutting
    })

    // 實時獲取 upcomingMusic，位於 musicQueue 頂端的資料
    this.musicQueue.onUpcomingMusic((music) => {
      this.upcomingMusic = music
    })
  },
  watch: {
    // 減輕 firebase onValue() 的負擔，當 showMessage 為 true 時才調用 onCuttingMessage
    showMessage(newVal) {
      // 有所變動時
      if (newVal) {
        this.musicQueue.onCuttingMessage((cuttingMessage) => {
          this.delayedMessage = cuttingMessage
        })
      }
    },
    upcomingMusic: {
      // 新舊值處理，僅當新值不等於舊值且舊值不為空時，才會進行切歌並播放音樂
      handler(newVal, oldVal) {
        if (newVal !== oldVal && oldVal != '') {
          this.playCutMusic()
        }
      },
      // 初始化的變動不會響應 watch
      immediate: false
    }
  },
  methods: {
    addMusic() {
      // 添加音樂到 MusicQueue
      this.musicQueue.addMusic(this.artist, this.songName, this.url)
      // 清空輸入欄位
      this.artist = ''
      this.songName = ''
      this.url = ''
    },
    // TODO(前端) 應該要有自動播放當前歌曲(播完的歌曲會從 firebase 中被移除)的邏輯

    // 資料庫中第一首歌自動播放和歌曲結束欲播放下一首時調用
    // 參數為下一首歌
    playNextMusic(music) {
      // 如果不是 firebase 的第一首，代表已經播完一首歌，刪除該首歌
      if (this.musics[0].key != music.key) {
        this.musicQueue.removeMusic(music)
      }

      // 在這裡觸發播放下一首音樂的程式
      console.log('Playing music:', music.songName)
    },
    // 手動強制切歌
    // 參數為切歌完後即將要播的歌
    cutMusic(music) {
      // 尋找目標音樂在 musics 陣列中的索引
      const index = this.musics.findIndex((m) => m.key === music.key)

      // 按下 musicQueue 第一首歌時不響應(第一首歌應該正在播放)
      if (index === 0) {
        console.log(`the first music is already playing NOW.`)
        return
      }
      // 取得目標音樂
      const targetMusic = this.musics[index]

      // 將即將要播的寫入 firebase
      this.musicQueue.setUpcomingMusic(targetMusic)

      // 取得頂端音樂
      const firstMusic = this.musics[0]

      // 延遲訊息
      this.showDelayedMessage(targetMusic)

      setTimeout(() => {
        // 將目標音樂從 musics 陣列中移除
        this.musics.splice(index, 1)

        // 將目標音樂加入到 musics 陣列的最上面
        this.musics.unshift(targetMusic)

        // 切歌
        this.musicQueue.replaceMusic(firstMusic, targetMusic)
      }, timeDelaySecond * 1000)
    },
    deleteMusic(music) {
      // 從 musicQueue 中移除指定音樂
      this.musicQueue.removeMusic(music)
    },
    showDelayedMessage(targetMusic) {
      // 寫入 isCutting 為 true，顯示切歌訊息
      this.musicQueue.setCutting(true)

      // 設定初始秒數
      let secondsLeft = timeDelaySecond

      // 初始訊息
      let msg = `${secondsLeft} 秒後進行切歌，即將播放： ${targetMusic.artist} - ${targetMusic.songName}`

      // 存進 firebase
      this.musicQueue.setterCutMusicMessage(msg)

      const intervalId = setInterval(() => {
        // 每秒減少一秒
        secondsLeft--

        // 訊息變更
        msg = `${secondsLeft} 秒後進行切歌，即將播放： ${targetMusic.artist} - ${targetMusic.songName}`
        this.musicQueue.setterCutMusicMessage(msg)
        if (secondsLeft === 0) {
          // 清除計時器
          clearInterval(intervalId)
          // 寫入 isCutting 為 false，隱藏切歌訊息
          this.musicQueue.setCutting(false)
        }
        // 毫秒數
      }, 1000)
    },
    // TODO(前端): 實作切歌後的播放歌曲
    playCutMusic() {
      setTimeout(() => {
        console.log(this.upcomingMusic)
      }, timeDelaySecond * 1000)
    }
  }
}
</script>

<style scoped>
.music-queue {
  max-width: 800px;
  padding: 20px;
  text-align: left;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.music-list {
  list-style-type: none;
  padding: 0;
}

.music-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.music-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.music-artist,
.music-song {
  margin-bottom: 5px;
}

.play-music-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.delete-music-btn {
  background-color: red;
  margin-left: 30px;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.add-music-form {
  position: fixed;
  bottom: 50px;
  display: flex;
  margin-top: 20px;
  border-top: 1px solid #ccc;
}

.input-field {
  flex: 1;
  padding: 5px;
  margin-right: 5px;
  border: 1px solid #007bff; /* 底部邊框 */
}

.add-music-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.form-divider {
  /* 分隔線 */
  height: 1.5px;
  width: 100%;
  background-color: #000000;
  margin-bottom: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.message {
  background-color: lightblue;
  padding: 10px;
  margin-top: 10px;
}
</style>
