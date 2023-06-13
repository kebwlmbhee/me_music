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
        <v-img src="/logo.png" alt="Fake"></v-img>
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
          border
        >
          <v-list-item-title class="text-left font-weight-black">{{
            explore.title
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-spacer></v-spacer>
      <nowPlaying style="height: 30%; position: absolute; bottom: 0; width: 100%" />
    </v-navigation-drawer>

    <!-- 右中-上 -->
    <v-app-bar class="px-2" color="grey-lighten-3" flat height="72">
      <v-app-bar-title class="font-weight-bold">#{{ SelectedPage }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <audio :src="MainMusic_url" autoplay id="mainAudio" @ended="whenMusicEnded"></audio>
      <audio :src="SecondMusic_url" id="secondAudio" @ended="PausePreviewAudio" autoplay></audio>
      <v-slider class="mt-5 mx-3" v-model="volume" min="0" max="1"> </v-slider>
      <v-btn :icon="volume_icon" @click="MuteButtonControl"></v-btn>
      <user-profile-button
        :userName="userProfile.name"
        :userImg="userProfile.avatar"
      ></user-profile-button>
    </v-app-bar>

    <!-- 右邊的東東 -->
    <v-navigation-drawer location="right" permanent color="grey-lighten-3   ">
      <music-que style="height: 100%" />
    </v-navigation-drawer>

    <!-- 要放Page的地方  應該用Router Route  或是Component -->
    <v-main style="height: 100vh">
      <router-view></router-view>
    </v-main>
    <!-- 跳彈窗 -->
    <v-dialog v-model="dialog" width="auto" persistent>
      <v-card>
        <v-card-text> Welcome to the clickLobby </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="DialogCallback">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="isShowSwitchMessage" :timeout="-1">
      <div class="centered-text">
        {{ switchMessage }}
      </div>
      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="state.snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import AudioControl from '@/stores/AudioControl'
import musicQueue from '/src/views/musicQ/musicQueue.js'

import UserProfileButton from '../components/UserProfileButton.vue'
import musicQue from '../components/SDJ/musicQue.vue'

import nowPlaying from '/src/components/SDJ/nowPlaying.vue'

export default {
  data() {
    return {
      Explores: [
        { title: '探索', to: '/Home/Explore' },
        { title: '我的音樂記錄', to: '/Home/MusicRecord' },
        { title: '聊天室', to: '/Home/Chat' }
      ],
      message: '',
      SelectedPage: '大廳',
      MainMusic_url: '',
      SecondMusic_url: '',
      // 靜音控制
      isMuted: false,
      MuteButton: '靜音',
      volume_icon: 'mdi-volume-high',
      volume: '',
      // Music Queue
      musics: [],
      dialog: true,
      isInitial: true,
      delayedMessage: '',
      playMusicTime: '',
      currentMusic: {},
      currentIndex: 0,
      switchMessage: '',
      isShowSwitchMessage: false,
      switchMessageTimeout: ''
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile', 'my_device_id']),
    ...mapState(AudioControl, ['isPreview'])
  },
  components: {
    UserProfileButton,
    musicQue,
    nowPlaying
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
      this.isPreviewStateChange(true)
      var secondAudio = document.getElementById('secondAudio')
      //if(!secondAudio.paused) secondAudio.pause();
      if (secondAudio) {
        secondAudio.load()
        secondAudio.src = url
      }
    },
    // 繼續播放Preview
    PreviewResume() {
      this.switchMessage = '切換至 Preview'
      this.isShowSwitchMessage = true

      this.MuteMainAudio()
      this.isPreviewStateChange(true)
      var secondAudio = document.getElementById('secondAudio')
      if (secondAudio.ended) secondAudio.load()
      else secondAudio.play()

      clearTimeout(this.switchMessageTimeout)
      this.setSwitchMessageTimeout()
    },
    // 暫停Second Audio 預覽音樂
    // MainAudio 靜音會根據當前是否處於靜音去調整
    PausePreviewAudio() {
      // 當暫停時 使MainAudio靜音取消
      // 暫停播放 Second Audio
      this.switchMessage = '切換至 Music Queue'
      this.isShowSwitchMessage = true
      this.isPreviewStateChange(false)
      var secondAudio = document.getElementById('secondAudio')
      if (secondAudio) secondAudio.pause()

      if (!this.isMuted) this.UnmuteMainAudio()

      clearTimeout(this.switchMessageTimeout)
      this.setSwitchMessageTimeout()
    },
    // 靜音按鈕的控制
    // 控制Preview 跟 MainAudio 的 靜音狀態
    MuteButtonControl() {
      this.isMuted = !this.isMuted
      var mainAudio = document.getElementById('mainAudio')
      var secondAudio = document.getElementById('secondAudio')
      if (this.isMuted) {
        this.volume_icon = 'mdi-volume-off'
        if (mainAudio) mainAudio.muted = true
        if (secondAudio) secondAudio.muted = true
      } else {
        this.volume_icon = 'mdi-volume-high'
        if (mainAudio && !this.isPreview) mainAudio.muted = false
        if (secondAudio) secondAudio.muted = false
      }
    },
    // 靜音 Main Audio
    MuteMainAudio() {
      var mainAudio = document.getElementById('mainAudio')
      if (mainAudio) mainAudio.muted = true
    },
    // 解除靜音 Main Audio
    UnmuteMainAudio() {
      if (this.isMuted) return
      if (this.isPreview) return

      var mainAudio = document.getElementById('mainAudio')
      if (mainAudio) mainAudio.muted = false
    },
    // 當音樂播放結束
    whenMusicEnded() {
      // var mainAudio = document.getElementById('mainAudio')
      if (this.MainMusic_url === this.musics[0].url) {
        this.musicQueue
          .removeMusicTransaction(this.musics[0])
          .then(() => {
            // this.showNextMusicMessage()
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
    // 切歌後的播放歌曲
    // newMusic : 要播放的歌的URL
    // waitTime : 等待時間
    playReplacedMusic(newMusic, waitTime = 3000) {
      setTimeout(() => {
        // 確定當前歌曲沒有被切掉，切掉要 return
        if (newMusic !== this.musics[0]) return
        this.MainMusic_url = this.musics[0].url
        var mainAudio = document.getElementById('mainAudio')
        mainAudio.load()
        // 歌曲播放時記錄播放時戳
        this.musicQueue.setTransactionMusicPlayTime(Date.now())
      }, waitTime)
    },
    // 進入頁面會處於畫面正中央彈窗的CallBack
    // 這裡點擊後才會開始獲取音樂的資訊
    // 原因 : 因為Google要求 需要用戶使用真實方式點擊頁面\
    //        才能使用自動播放的功能
    DialogCallback() {
      var mainAudio = document.getElementById('mainAudio')
      // music Queue
      this.musicQueue = new musicQueue()
      // 取得時間使音樂同步
      this.musicQueue.getMusicPlayTime((startTime) => {
        this.playMusicTime = startTime + 3
        mainAudio.currentTime = this.playMusicTime
      })

      // 在組件創建時註冊 MusicQueue 的監聽器
      // 實時獲取 musicQueue 資料
      this.musicQueue.onMusic((musics) => {
        this.musics = musics
      })

      // 實時獲取訊息
      this.musicQueue.onSwitchMusicNotification((message) => {
        this.delayedMessage = message
      })
      mainAudio.volume = 0.5
      this.dialog = false
    },
    setSwitchMessageTimeout() {
      this.switchMessageTimeout = setTimeout(() => {
        this.isShowSwitchMessage = false
      }, 1000)
    },
    ...mapActions(UserStatus, ['checkAuth', 'update_device_id']),
    ...mapActions(AudioControl, ['isPreviewStateChange'])
  },
  mounted() {
    // 這個是因為一開始無法直接使用$route
    // 所以過0.1s 後再去更改其值
    setTimeout(() => {
      if (this.$route && this.$route.name) this.SelectedPage = this.$route.name
      this.volume = 0.5
    }, 100)
    this.checkAuth()

    // Web Playback SDK
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb) => {
          cb(this.authCode.access_token)
        },
        volume: 1
      })

      // Ready
      player.addListener('ready', ({ device_id }) => {
        this.update_device_id(device_id)
      })

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.error('Device ID has gone offline', device_id)
      })

      player.addListener('initialization_error', ({ message }) => {
        console.error(message)
      })

      player.addListener('authentication_error', ({ message }) => {
        console.error(message)
      })

      player.addListener('account_error', ({ message }) => {
        console.error(message)
      })

      player.setVolume(1)

      // player.addListener('player_state_changed', ({ track_window: { current_track } }) => {
      //   console.log('Currently Playing', current_track)
      //   this.current_track_name = current_track.album.name
      //   this.current_track_img = current_track.album.images[0].url
      // })

      // document.getElementById('togglePlay').onclick = function () {
      //   player.togglePlay()
      // }

      // document.getElementById('togglePrev').onclick = function () {
      //   player.previousTrack()
      // }

      // document.getElementById('toggleNext').onclick = function () {
      //   player.nextTrack()
      // }

      player.connect()
    }
  },
  provide() {
    return {
      PlayPreview: this.PlayPreviewAudio,
      PausePreview: this.PausePreviewAudio,
      PreviewResume: this.PreviewResume
    }
  },
  watch: {
    musics: {
      // 新舊值處理
      handler(newVal, oldVal) {
        // 首位變動才要替換
        if (oldVal[0] && newVal[0] && newVal[0].timestamp !== oldVal[0].timestamp) {
          // 偵測到變動，不用註明是歌曲結束還是被切歌，處理相同的問題
          this.playReplacedMusic(newVal[0])
        } else if (!oldVal[0] && newVal[0]) {
          // 當有現有MusicQueue為空 且 新的不為空時
          // 然後會判斷是否為剛開始的初始化
          // 因為有可能是播到沒歌了
          if (this.isInitial) {
            this.playReplacedMusic(newVal[0], 0)
            this.isInitial = false
          } else this.playReplacedMusic(newVal[0])
        }
      },
      // 初始化的變動不會響應 watch
      immediate: false
    },
    volume: function (newVal) {
      var mainAudio = document.getElementById('mainAudio')
      var secondAudio = document.getElementById('secondAudio')

      if (mainAudio) mainAudio.volume = newVal
      if (secondAudio) secondAudio.volume = newVal
    }
  }
}
</script>

<style>
.centered-text {
  text-align: center;
}
</style>
