<template>
  <!-- <audio autoplay src="../views/Test.mp3"></audio> -->
  <v-app id="inspire">
    <!-- 左 -->
    <v-navigation-drawer width="244" permanent>
      <!-- 左 放商標的? -->
      <!--  -->
      <v-sheet
        id="Lobby-Button"
        color="grey-lighten-5"
        height="128"
        width="100%"
        @click="clickLobby"
      >
        <v-img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGQDqS3rBb7GyPj87cxlKGJM1VC3CFIaUBg&usqp=CAU"
          alt="Fake"
        ></v-img>
      </v-sheet>
      <!-- 底下的Item -->
      <v-list mandatory>
        <v-list-item
          v-for="(explore, index) in Explores"
          :key="index"
          :value="index"
          link
          :to="explore.to"
          @click="
            () => {
              SelectedPage = explore.title
            }
          "
          :data-test="explore.title"
        >
          <v-list-item-title class="text-left font-weight-black">{{
            explore.title
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 右中-上 -->
    <v-app-bar class="px-2" color="grey-lighten-4" flat height="72">
      <v-app-bar-title class="font-weight-bold">#{{ SelectedPage }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn class="ma-3 font-weight-bold" border @click="MuteButtonControl">{{
        MuteButton
      }}</v-btn>
      <user-profile-button
        :userName="userProfile.name"
        :userImg="userProfile.avatar"
      ></user-profile-button>
    </v-app-bar>

    <!-- 右邊的東東 -->
    <v-navigation-drawer location="right" permanent>
      <music-que />
      <div>
        <audio
          :src="MainMusic_url"
          autoplay
          id="mainAudio"
          controls
          @ended="whenMusicEnded"
        ></audio>
        <audio :src="SecondMusic_url" id="secondAudio" autoplay controls></audio>
      </div>
    </v-navigation-drawer>

    <!-- 要放Page的地方  應該用Router Route  或是Component -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-text> Welcome to the clickLobby </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="DialogCallback">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import musicQueue from '/src/views/musicQ/musicQueue.js'

import UserProfileButton from '../components/UserProfileButton.vue'
import musicQue from '../components/SDJ/musicQue.vue'

export default {
  data() {
    return {
      Explores: [
        { title: '探索', to: '/Home/Explore' },
        { title: '我的音樂記錄', to: '/Home/MusicRecord' },
        { title: '聊天室', to: '/Home/Chat' }
      ],
      FakeData: {
        ChatroomMembers: [
          { ava: '', Name: 'member1', alt: 'M1' },
          { ava: '', Name: 'member2', alt: 'M2' },
          { ava: '', Name: 'member3', alt: 'M3' },
          { ava: '', Name: 'member4', alt: 'M4' },
          { ava: '', Name: 'member5', alt: 'M5' }
        ]
      },
      message: '',
      SelectedPage: '大廳',
      MainMusic_url: '',
      SecondMusic_url: '',
      // 靜音控制
      isMuted: false,
      isPreview: false,
      MuteButton: '靜音',
      // Music Queue
      musics: [],
      dialog: true,
      delayedMessage: '',
      playMusicTime: '',
      currentMusic: {},
      // 測試參數
      currentIndex: 0
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  components: {
    UserProfileButton,
    musicQue
  },
  methods: {
    // 點擊大廳
    clickLobby() {
      this.SelectedPage = '大廳'
      this.$router.push({
        path: '/Home'
      })
    },
    // 使用Second Audio 預覽音樂
    PlayPreviewAudio(url) {
      if (url == null) return
      // 控制Second Audio 播放
      // 當開始播放時 靜音MainAudio
      // 開始播放 Second Audio
      this.MuteMainAudio()
      this.isPreview = true
      console.log('Play Second Audio' + url)
      var secondAudio = document.getElementById('secondAudio')
      //if(!secondAudio.paused) secondAudio.pause();
      secondAudio.load()
      secondAudio.src = url
    },
    // 暫停Second Audio 預覽音樂
    PausePreviewAudio() {
      // 當暫停時 使MainAudio靜音取消
      // 暫停播放 Second Audio
      this.isPreview = false
      console.log('Pause Second Audio')
      var secondAudio = document.getElementById('secondAudio')
      secondAudio.pause()

      if (!this.isMuted) this.UnmuteMainAudio()
      else this.MuteMainAudio()
    },
    // 靜音按鈕的控制
    MuteButtonControl() {
      this.isMuted = !this.isMuted
      if (this.isMuted) {
        this.MuteButton = '取消靜音'
        this.MuteMainAudio()
      } else {
        this.UnmuteMainAudio()
        this.MuteButton = '靜音'
      }
    },
    // 靜音 Main Audio
    MuteMainAudio() {
      if (this.isPreview) return
      var mainAudio = document.getElementById('mainAudio')
      mainAudio.volume = 0.0
    },
    // 解除靜音 Main Audio
    UnmuteMainAudio() {
      if (this.isPreview) return
      var mainAudio = document.getElementById('mainAudio')
      mainAudio.volume = 1.0
    },
    // 當音樂播放結束
    whenMusicEnded() {
      // var mainAudio = document.getElementById('mainAudio')
      if (this.currentMusic === this.musics[0]) {
        this.musicQueue
          .removeMusicTransaction(this.currentMusic)
          .then(() => {
            // this.showNextMusicMessage()
            console.log('歌曲播放完畢')
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
    // TODO(前端): 實作切歌後的播放歌曲
    playReplacedMusic(newMusic) {
      setTimeout(() => {
        // 確定當前歌曲沒有被切掉，切掉要 return
        if (newMusic !== this.musics[0]) return
        // TODO(前端): console.log() 應替換為播放歌曲的 code
        console.log(this.musics[0])
        var mainAudio = document.getElementById('mainAudio')
        mainAudio.src = this.musics[0].url
        // 歌曲播放時記錄播放時戳
        this.musicQueue.setTransactionMusicPlayTime(Date.now())
      }, 100)
    },
    DialogCallback() {
      // music Queue
      this.musicQueue = new musicQueue()
      // 取得時間使音樂同步
      this.musicQueue.getMusicPlayTime((startTime) => {
        var mainAudio = document.getElementById('mainAudio')
        this.playMusicTime = startTime
        mainAudio.currentTime = this.playMusicTime
        console.log(`this.playMusicTime = ${this.playMusicTime}`)
      })

      // 在組件創建時註冊 MusicQueue 的監聽器
      // 實時獲取 musicQueue 資料
      this.musicQueue.onMusic((musics) => {
        var mainAudio = document.getElementById('mainAudio')
        this.musics = musics
        this.currentMusic = this.musics[0]
        mainAudio.src = this.musics[0].url
        mainAudio.play()
      })

      // 實時獲取訊息
      this.musicQueue.onSwitchMusicNotification((message) => {
        this.delayedMessage = message
      })

      this.dialog = false
    },
    ...mapActions(UserStatus, ['checkAuth'])
  },
  mounted() {
    setTimeout(() => {
      this.SelectedPage = this.$route.name
    }, 100)
    this.checkAuth()
  },
  provide() {
    return {
      PlayPreview: this.PlayPreviewAudio,
      PausePreview: this.PausePreviewAudio
    }
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
    }
  }
}
</script>
