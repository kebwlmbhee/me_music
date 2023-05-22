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
        <div class="leftDiv" style="background-color: aqua">
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
            <v-btn class="bg-green" style="width: 30%; height: 80%; font-size: 0.8em">播放</v-btn>
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
              height: 20%;
              margin-bottom: 10px;
              font-size: 1em;
            "
          >
            <span style="display: flex; align-items: center; height: 100%">
              <span style="font-size: 0.8em"
                ><b
                  >來自 <span class="text-blue">{{ item.musicPlayer.name }}</span> 的廣播</b
                >
              </span>
              <span class="gjButton" style="height: 100%; font-size: 1em">
                <v-btn
                  class="bg-green"
                  style="width: auto; height: 80%; font-size: 0.8em; margin-left: 10px"
                >
                  <span class="material-symbols-outlined" style="font-size: 1em"> thumb_up </span>
                  <span style="font-size: 1em; margin-left: 10%">按讚</span>
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
              height: 20%;
              margin-bottom: 10px;
            "
          >
            <div style="display: flex; justify-content: center; height: 100%">
              <img
                :src="item.musicPlayer.avatar"
                alt="test"
                style="width: auto; height: 100%; max-height: 100%"
              />
            </div>

            <div
              style="
                width: 100%;
                height: 100%;
                background-color: white;
                font-size: 1em;
                margin-left: 10px;
              "
            >
              {{ item.something }}
            </div>
          </div>

          <div style="width: 100%; background-color: white; flex: 1">
            <span style="color: black">
              <!-- <v-btn @click="test">test</v-btn>
                            <Test :name="X"></Test>
                            <Test v-for="item in test1" :key="item.id" :name="`${item.name}`"></Test> -->
              <Test></Test>
            </span>
          </div>
        </div>
      </div>
    </div>
  </html>
</template>

<script>
import { reactive } from 'vue'
import Chatroom from '../../views/chatroom/chatroom.js'

export default {
  setup() {
    let songList = reactive([])
    var chatroom = new Chatroom()
    chatroom.onAnnouncement((messages) => {
      const announcements = reactive(messages)
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
      // clean songList
      songList.splice(0, songList.length)

      // import songList from firebase
      announcements.forEach((element) => {
        songList.push({
          ID: 'id',
          songImage: element.musicInfo.picture,
          songTitle: element.musicInfo.songName,
          songInfo: element.musicInfo.artist,
          musicPlayer: element.author,
          time: chatroom.getTimeString(element.time),
          something: element.text,
          others: '訪客留言'
        })
      })
    })

    return { songList }
  }
}
</script>

<style lang="scss" scoped>
/* default => max-width: 1400px */
/* wrong */
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
  /* background-color: black; */
}

@media (min-width: 1600px) {
  html {
    font-size: 20px;
  }

  // flexColumn {
  //   /* background-color: yellowgreen; */
  // }
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
</style>
