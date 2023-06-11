<template>
  <html class="flexColumn outBox">
    <v-app-bar color="#FFF176" flat>
      <v-spacer></v-spacer>
      <div style="font-size: 2em">
        <b>Announcement</b>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- first part -->
    <div class="firstPart" v-for="item in songList" :key="item.ID">
      <div class="inBox">
        <!-- left div -->
        <div class="leftDiv">
          <img :src="item.songImage" alt="songImgage" style="width: 100%; max-height: 100%" />
        </div>

        <!-- mid div -->
        <div class="flexColumn midDiv">
          <span>
            <h2>{{ item.songTitle }}</h2>
            <h5>{{ item.songInfo }}</h5>
          </span>
          <span
            class="playButton"
            style="
              display: flex;
              justify-content: space-around;
              height: 20%;
              width: 100%;
              font-size: 1em;
            "
          >
            <v-btn
              class="bg-green"
              style="width: 30%; height: 80%; font-size: 0.8em"
              @click="PlayButtonCallback(item)"
              >播放</v-btn
            >
          </span>
        </div>

        <!-- right div -->
        <div class="flexColumn rightDiv">
          <span
            class="topSpan"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 30%;
              margin-bottom: 10px;
              font-size: 1em;
            "
          >
            <span style="display: flex; align-items: center; height: 100%">
              <span style="font-size: 1em"
                ><b
                  >來自 <span class="text-blue">{{ item.musicPlayer.name }}</span> 的廣播</b
                >
              </span>
              <span class="gjButton" style="height: 75%; font-size: 1em">
                <v-btn
                  @click="likesButton(item)"
                  :class="{ 'bg-green': !item.liked, test: item.liked }"
                  style="width: auto; height: 80%; font-size: 0.8em; margin-left: 10px"
                >
                  <span class="material-symbols-outlined" style="font-size: 1em"> thumb_up </span>
                  <span style="font-size: 1em; margin-left: 10%">
                    {{ item.liked ? '已按讚' : '按讚' }}
                    {{ item.likeCount ? item.likeCount : 0 }}
                  </span>
                </v-btn>
              </span>
            </span>
            <span style="font-size: 0.8em">{{ item.time }}</span>
          </span>

          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              height: 60%;
              margin-bottom: 10px;
            "
          >
            <div style="display: flex; justify-content: center; height: 100%">
              <v-avatar :image="item.musicPlayer.avatar" size="80"></v-avatar>
            </div>

            <div style="width: 100%; height: 40%; font-size: 1.2em; margin-left: 10px">
              {{ item.something }}
            </div>
          </div>

          <!-- Show All button -->
          <v-btn class="show-all-button" @click="showAllText(item.fullText)">顯示完整內容</v-btn>
        </div>
      </div>
    </div>

    <!-- Modal dialog -->
    <v-dialog v-model="showModal" max-width="600">
      <v-card>
        <v-card-title>完整內容</v-card-title>
        <v-card-text>
          <!-- Full text content -->
          {{ fullText }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeModal">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </html>
</template>

<script>
import { reactive, ref } from 'vue'
import Chatroom from '/src/views/chatroom/chatroom.js'
import AnnouncementLikes from '/src/views/announcement/announcementLikes.js'

import UserStatus from '/src/stores/UserStatus.js'
import AudioControl from '../../stores/AudioControl'

export default {
  setup() {
    const userStatus = reactive(UserStatus())
    const audioControl = reactive(AudioControl())
    let songList = reactive([])
    var chatroom = new Chatroom()
    const showModal = ref(false)
    const fullText = ref('')
    var announcementLikes = new AnnouncementLikes()
    var userid = userStatus.userProfile.id

    chatroom.onAnnouncement((messages) => {
      userid = userStatus.userProfile.id
      const announcements = messages.map((ParamAnnouncement) => {
        // 確認回傳的型態正確
        if (typeof ParamAnnouncement === 'object') {
          return {
            // 保留 callback 的回傳值
            ...ParamAnnouncement,
            // 加入 likeCount 屬性，僅在本地運行，不會寫入 firebase
            likeCount: 0,
            // 加入 liked 屬性，僅在本地運行，不會寫入 firebase
            liked: false
          }
        }
      })
      // sort by timestamp
      announcements.sort((a, b) => b.time - a.time)
      // keep the lastest 10 announcements
      while (announcements.length > 10) {
        // 獲取最後一個元素
        const announcement = announcements[announcements.length - 1]
        // 刪除最後一個元素(Website)
        announcements.pop()
        // 刪除最後一個元素(Firebase)
        chatroom.removeAnnouncement(announcement)
      }

      // like update
      async function test() {
        await announcementLikes.getAnnouncementLikes((announcementId, likeCount) => {
          // 尋找遍歷到的 id
          const targetAnnouncement = announcements.find(
            (announcement) => announcement.id === announcementId
          )
          if (targetAnnouncement) {
            // 更新指定公告的讚數
            targetAnnouncement.likeCount = likeCount
            // 檢查是否按過讚
            const userId = userid
            // 如果 "該 userId 存在"
            // 且 "該 announcement 下的 likes 路徑存在"
            // 且 "該 userId 存在於該 announcement 的 likes 路徑中"
            if (userId && targetAnnouncement.likes && targetAnnouncement.likes[userId]) {
              // 標記為已按讚
              targetAnnouncement.liked = true
            }
          }
        })

        // clean songList
        songList.splice(0, songList.length)

        // import songList from firebase
        announcements.forEach((element) => {
          let fullText = element.text
          let max_str = 18
          if (element.text.length > max_str) {
            element.text = element.text.substring(0, max_str) + ' ...'
          }

          songList.push({
            id: element.id,
            songImage: element.musicInfo.picture,
            songTitle: element.musicInfo.songName,
            songInfo: element.musicInfo.artist,
            musicPlayer: element.author,
            time: chatroom.getTimeString(element.time),
            fullText: fullText,
            something: element.text,
            others: '訪客留言',
            liked: element.liked,
            likeCount: element.likeCount
          })
        })
      }

      test()
    })

    const likesButton = async (announcement) => {
      try {
        // userProfile.id 為空時會出錯，若獲取不到 userId 時，應該 alert 後 return
        if (!userid) {
          alert('請重新登入')
          return
        }
        // 點擊讚後的響應會由後端進行判斷
        // 若為已按讚的狀態下會取消，未按讚的狀況下會新增
        await announcementLikes.likeButtonForAnnouncement(announcement.id, userid)
      } catch (error) {
        // 按鈕的意外錯誤
        console.error(error)
      }
    }

    // 點播按鈕觸發
    function PlayButtonCallback(data) {
      audioControl
        .UseTrackNameAndArtistStateUpdate(
          userStatus.authCode.access_token,
          data.songTitle,
          data.songInfo
        )
        .then(() => {
          audioControl.addQue()
        })
    }

    function showAllText(text) {
      fullText.value = text
      showModal.value = true
    }

    function closeModal() {
      showModal.value = false
    }

    return {
      songList,
      likesButton,
      PlayButtonCallback,
      showAllText,
      closeModal,
      fullText,
      showModal
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  background-color: grey;
}

html {
  font-size: 16px;

  .outBox {
    align-items: center;
    justify-content: baseline;
    width: 100%;
    height: 100%;
    padding: 2%;

    .firstPart {
      width: 100%;
      height: 200px;
      max-width: 1200px;
      background-color: #cfcfcf;
      padding: 10px;
      margin: 10px;

      .inBox {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .leftDiv {
          display: flex;
          width: 20%;
          height: 100%;
          padding: 10px;
        }

        .midDiv {
          justify-content: space-between;
          width: 20%;
          height: 100%;
          padding: 10px;
        }

        .rightDiv {
          width: 55%;
          height: 100%;
          justify-self: right;
          padding: 1%;
        }
      }
    }
  }
}

.flexColumn {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1600px) {
  html {
    font-size: 20px;
  }
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #e2e2e2;
  //border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(133, 133, 133);
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.show-all-button {
  margin: 10px;
  background-color: rgb(194, 169, 128);
}
</style>
