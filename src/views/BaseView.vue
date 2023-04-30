<template>
  <!-- <audio autoplay src="../views/Test.mp3"></audio> -->
  <v-app id="inspire">
    <!-- 左 -->
    <v-navigation-drawer width="244" permanent>
      <!-- 左 放商標的? -->
      <!--  -->
      <v-sheet color="grey-lighten-5" height="128" width="100%" @click="clickLobby">
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

      <user-profile-button
        :userName="userProfile.name"
        :userImg="userProfile.avatar"
      ></user-profile-button>
    </v-app-bar>

    <!-- 右邊的東東 -->
    <v-navigation-drawer location="right" permanent>
      <v-list>
        <v-list-item
          v-for="(member, index) in FakeData['ChatroomMembers']"
          :key="index"
          :title="member.Name"
          link
        >
          <!-- :prepend-avatar="'https://cdn.vuetifyjs.com/images/lists/1.jpg'" -->
          <template v-slot:prepend>
            <v-avatar color="brown">{{ member.alt }}</v-avatar>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <div>
        <audio
          :src="MainMusic_url"
          autoplay
          id="mainAudio"
          controls
          @ended="whenMusicEnded"
        ></audio>
        <audio :src="SecondMusic_url" id="secondAudio" autoplay controls loop></audio>
      </div>
    </v-navigation-drawer>

    <!-- 要放Page的地方  應該用Router Route  或是Component -->
    <v-main>
      <router-view v-if="isRouterAlive"></router-view>
    </v-main>
  </v-app>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import MusicQueue from '@/stores/MusicQueue'

import UserProfileButton from '../components/UserProfileButton.vue'

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
      isRouterAlive: true,
      MainMusic_url: '',
      SecondMusic_url: ''
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  components: {
    UserProfileButton
  },
  methods: {
    clickLobby() {
      this.SelectedPage = '大廳'
      this.$router.push({
        path: '/Home'
      })
    },
    reload() {
      // 重新加載頁面 ?
      this.isRouterAlive = false
      this.SelectedPage = this.$route.name
      setTimeout(() => {
        console.log('reload')
        this.isRouterAlive = true
      }, 100)
    },
    whenMusicEnded() {
      // 當音樂播放結束
      console.log('music is ended')
      var nextMusic = this.ShiftTheMusic()
      if (nextMusic == null) {
        return
      }
      this.MainMusic_url = nextMusic.mp3
    },
    WhenAddTheNewMusic() {
      console.log('WhenAddTheNewMusic Start')
      var mainAudio = document.getElementById('mainAudio')
      if (!mainAudio.paused) return
      this.MainMusic_url = this.ShiftTheMusic().mp3
    },
    PlayPreviewAudio(url) {
      // 控制Second Audio 播放
      // 當開始播放時 靜音MainAudio
      // 開始播放 Second Audio
      console.log('Play Second Audio' + url)
      var secondAudio = document.getElementById('secondAudio')
      //if(!secondAudio.paused) secondAudio.pause();
      secondAudio.load()
      secondAudio.src = url
    },
    PausePreviewAudio() {
      // 當暫停時 使MainAudio靜音取消
      // 暫停播放 Second Audio
      console.log('Pause Second Audio')
      var secondAudio = document.getElementById('secondAudio')
      secondAudio.pause()
    },
    ...mapActions(UserStatus, ['checkAuth']),
    ...mapActions(MusicQueue, ['ShiftTheMusic'])
  },
  mounted() {
    setTimeout(() => {
      this.SelectedPage = this.$route.name
    }, 100)
    this.checkAuth()
    /// TODO : 要先獲取當前的 MusicQueue 存儲 於FireBase
  },
  provide() {
    return {
      Reload: this.reload,
      AddMusic: this.WhenAddTheNewMusic,
      PlayPreview: this.PlayPreviewAudio,
      PausePreview: this.PausePreviewAudio
    }
  }
}
</script>
