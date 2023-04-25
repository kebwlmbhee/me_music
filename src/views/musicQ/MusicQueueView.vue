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
        <button @click="manualPlayMusic(music)" class="play-music-btn">Play</button>
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
      <div v-if="showMessage" key="message" class="message">
        {{ delayedMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
// TODO: 切歌時的公告需要進行廣播，讓所有人知道即將被切歌，可能前端要使用彈出式視窗呈現
// TODO: 如果A切歌途中偵測到另一人切歌(B)時的處置方式，
//       是需要當前的切歌被迫取消，改為B的切歌？ => 需要監聽另一個值判斷當前切歌與否
//       兩者的切歌都被接受，但A的歌曲就等於幾乎沒播就被強制切掉 => 不做處置
import musicQueue from '/src/views/musicQ/musicQueue.js'

const timeDelaySecond = 5

export default {
  data() {
    return {
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
    // 資料庫中第一首歌自動播放和歌曲結束時調用
    // 應該要有自動跳至下一首的邏輯(前端補)
    // 參數為下一首歌
    autoPlayMusic(music) {
      // 如果不是 firebase 的第一首，代表已經播完一首歌，刪除該首歌
      if (this.musics[0].key != music.key) {
        this.musicQueue.removeMusic(music)
      }

      // 在這裡觸發播放下一首音樂的程式
      console.log('Playing music:', music.songName)
    },
    // 手動強制切歌
    manualPlayMusic(music) {
      // 尋找目標音樂在 musics 陣列中的索引
      const index = this.musics.findIndex((m) => m.key === music.key)

      // 取得目標音樂
      const targetMusic = this.musics[index]

      console.log(targetMusic)

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

        // 在這裡觸發播放音樂的邏輯
        console.log('Playing music:', music.songName)
      }, timeDelaySecond * 1000)
    },
    deleteMusic(music) {
      // 從 musics 陣列中移除指定音樂(Website)
      const index = this.musics.findIndex((m) => m.key === music.key)
      this.musics.splice(index, 1)

      // 從 musicQueue 中移除指定音樂(Firebase)
      this.musicQueue.removeMusic(music)
    },
    showDelayedMessage(targetMusic) {
      this.showMessage = true
      let secondsLeft = timeDelaySecond // 設定初始秒數
      this.delayedMessage = `${secondsLeft} 秒後進行切歌，即將播放： ${targetMusic.songName}`
      const intervalId = setInterval(() => {
        secondsLeft-- // 每秒減少一秒
        this.delayedMessage = `${secondsLeft} 秒後進行切歌，即將播放： ${targetMusic.songName}`
        if (secondsLeft === 0) {
          clearInterval(intervalId) // 清除計時器
          this.showMessage = false // 隱藏訊息
        }
      }, 1000)
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
