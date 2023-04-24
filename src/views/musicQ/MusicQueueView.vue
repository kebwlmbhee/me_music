<template>
  <div class="music-queue">
    <h1 class="title">Music Queue</h1>
    <ul class="music-list">
      <li class="music-item" v-for="music in musics" :key="music.url">
        <div class="music-info">
          <div class="music-artist">Artist: {{ music.artist }}</div>
          <div class="music-song">Song: {{ music.song }}</div>
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
        <button @click="playMusic(music.url)" class="play-music-btn">Play</button>
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
</template>

<script>
import musicQueue from '/src/views/musicQ/musicQueue.js'

export default {
  data() {
    return {
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
    playMusic(url) {
      // 在這裡觸發播放音樂的邏輯
      console.log('Playing music:', url)

      // 尋找目標音樂在 musics 陣列中的索引
      const index = this.musics.findIndex((music) => music.url === url)

      // 將目標音樂從 musics 陣列中移除
      const targetMusic = this.musics.splice(index, 1)[0]

      // 將目標音樂加入到 musics 陣列的最上面
      this.musics.unshift(targetMusic)
    },
    deleteMusic(music) {
      // 從 musics 陣列中移除指定音樂(Website)
      const index = this.musics.findIndex((m) => m.url === music.url)
      this.musics.splice(index, 1)

      // 從 musicQueue 中移除指定音樂(Firebase)
      this.musicQueue.removeMusic(music)
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
</style>
