<template>
  <div class="music-queue">
    <h1 class="title">Music Queue</h1>
    <ul class="music-list" v-if="musics.length > 0">
      <li class="music-item" v-for="music in musics" :key="music.key">
        <div class="music-info">
          <div class="music-id">id: {{ music.id }}</div>
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
            >
          </span>
        </div>
        <button @click="cutMusic(music)" class="play-music-btn">Play</button>
        <button @click="deleteMusic(music)" class="delete-music-btn">Delete</button>
        <div v-if="music.key == musics[0].key">
          <button @click="musicEnded(music)" class="End-music-btn">EndMusic</button>
        </div>
      </li>
    </ul>

    <!-- 分隔線 -->
    <div class="form-divider"></div>

    <form class="add-music-form" @submit.prevent="addMusic">
      <input v-model="id" type="text" placeholder="id" class="input-field" />
      <input v-model="artist" type="text" placeholder="Artist" class="input-field" />
      <input v-model="songName" type="text" placeholder="Song Name" class="input-field" />
      <input v-model="url" type="text" placeholder="Type URL" class="input-field" />
      <button type="submit" class="add-music-btn">Add Music</button>
    </form>
  </div>
  <div>
    <transition name="fade" mode="out-in">
      <!-- 如果 isCutting 或 isEnded 為 true，顯示訊息 -->
      <div v-if="isNext" key="message" class="message">
        {{ delayedMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
// (現在時戳 - 播放時戳) = 現在播放到的秒數

// TODO(前端): 切歌時的公告要使用彈出式視窗呈現
import musicQueue from '/src/views/musicQ/musicQueue.js'

// 延遲 3 秒(顯示待播歌曲訊息)
const timeCutMusicSecond = 3

export default {
  data() {
    return {
      isNext: false,
      delayedMessage: '',
      playMusicTime: '',

      id: '',
      artist: '',
      picture: '',
      album: '',
      songName: '',
      url: '',
      musics: []
    }
  },
  async created() {
    // 在組件創建時註冊 MusicQueue 的監聽器
    // 實時獲取 musicQueue 資料
    this.musicQueue = new musicQueue()
    this.musicQueue.onMusic((musics) => {
      this.musics = musics
    })

    // 實時獲取訊息
    this.musicQueue.onSwitchMusicNotification((message) => {
      this.delayedMessage = message
    })

    // 取得時間使音樂同步
    this.musicQueue.getMusicPlayTime((startTime) => {
      this.playMusicTime = startTime
      console.log(this.playMusicTime)
    })
  },
  watch: {
    musics: {
      // 新舊值處理
      handler(newVal, oldVal) {
        // 首位變動才要替換
        if (oldVal[0] && newVal[0] && newVal[0].id !== oldVal[0].id) {
          // 偵測到變動，不用註明是歌曲結束還是被切歌，處理相同的問題
          this.playReplacedMusic(newVal[0])
        } else if (!newVal) {
          this.musicQueue.setTransactionMusicPlayTime(0)
        }
      },
      // 初始化的變動不會響應 watch
      immediate: false
    },
    delayedMessage: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && oldVal != '') {
          this.showNextMusicMessage()
        }
      }
    }
  },
  methods: {
    // 添加音樂到 musicQueue，這裡使用註冊方式添加
    addMusic() {
      this.musicQueue.addMusic(
        this.id,
        this.artist,
        this.songName,
        this.url,
        this.picture,
        this.album
      )
      // 清空輸入欄位
      this.id = ''
      this.artist = ''
      this.songName = ''
      this.url = ''
    },

    // API 請改用此方法
    // 添加音樂到 musicQueue ，這裡使用 API 傳入
    // addMusic(id, artist, songName, url, picture, album) {
    //   this.musicQueue.addMusic(id, artist, songName, url, picture, album);
    // },

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

      // 取得頂端音樂
      const firstMusic = this.musics[0]

      // 切歌，將變動存至 firebase
      this.musicQueue.replaceMusic(firstMusic, targetMusic)

      // 切歌完成，響應至 musicQueue 後才調用延遲訊息，同步本地和遠端
      this.showNextMusicMessage()
      console.log('切歌成功')
    },
    // 從 musicQueue 中移除指定音樂
    deleteMusic(music) {
      this.musicQueue.removeMusic(music)
    },
    // 設置待播訊息
    showNextMusicMessage() {
      if (!this.musics[0]) return
      // 初始訊息
      let msg = `即將播放： ${this.musics[0].artist} - ${this.musics[0].songName}`

      // 存進 firebase
      if (msg !== this.delayedMessage) this.musicQueue.setterSwitchMusicNotification(msg)

      // 本地倒數計時
      this.countDownToPlay(msg)
    },
    // 訊息顯示倒計時
    countDownToPlay(msg) {
      this.isNext = true
      setTimeout(() => {
        // 訊息等待時間若沒遇到切歌/歌曲結束
        if (msg === this.delayedMessage) this.isNext = false
      }, timeCutMusicSecond * 1000)
    },
    // TODO(前端): 實作切歌後的播放歌曲
    playReplacedMusic(newMusic) {
      setTimeout(() => {
        // 確定當前歌曲沒有被切掉，切掉要 return
        if (newMusic !== this.musics[0]) return
        // TODO(前端): console.log() 應替換為播放歌曲的 code
        console.log(this.musics[0])
        // 歌曲播放時記錄播放時戳
        this.musicQueue.setTransactionMusicPlayTime(Date.now())
      }, timeCutMusicSecond * 1000)
    },
    // 歌曲結束時調用，參數為當前已播畢的歌
    musicEnded(readyToRemoveMusic) {
      if (readyToRemoveMusic === this.musics[0]) {
        this.musicQueue
          .removeMusic(readyToRemoveMusic)
          .then(() => {
            this.showNextMusicMessage()
            console.log('歌曲播放完畢')
          })
          .catch((error) => {
            console.error(error)
          })
      }
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

.music-id,
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

.End-music-btn {
  background-color: green;
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
  width: 150px;
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
