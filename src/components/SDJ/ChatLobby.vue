<template>
  <html
    class="flexColumn Rem"
    style="
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      overflow: auto;
    "
  >
    <!-- first part -->
    <div
      style="width: 100%; height: 30%; max-width: 1200px; background-color: #cfcfcf; padding: 10px"
    >
      <div
        style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <!-- left div -->
        <div style="display: flex; width: 20%; height: 100%; padding: 10px">
          <img
            src="https://i.imgur.com/pJziasF.jpeg"
            alt="test"
            style="width: 100%; max-height: 100%"
          />
        </div>

        <!-- mid div -->
        <div
          class="flexColumn"
          style="justify-content: space-between; width: 20%; height: 100%; padding: 10px"
        >
          <span>
            <h2>{{ songList[0].songTitle }}</h2>
            <h5>{{ songList[0].songInfo }}</h5>
          </span>
          <span
            style="
              display: flex;
              justify-content: space-around;
              height: 20%;
              width: 100%;
              font-size: 1em;
            "
          >
            <v-btn class="bg-green" style="width: 30%; height: 80%; font-size: 0.8em">播放</v-btn>
            <v-btn class="bg-green" style="width: 50%; height: 80%; font-size: 0.8em"
              >加入音樂庫</v-btn
            >
          </span>
        </div>

        <!-- right div -->
        <div class="flexColumn" style="width: 55%; height: 100%; justify-self: right; padding: 1%">
          <span
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 20%;
              margin-bottom: 10px;
              font-size: 1em;
            "
          >
            <span style="font-size: 0.8em"
              ><b>來自 {{ songList[0].musicPlayer }} 的廣播</b></span
            >
            <span style="height: 100%; font-size: 1em">
              <v-btn
                class="bg-green"
                style="width: auto; height: 80%; font-size: 0.8em; margin-left: 10px"
              >
                <span class="material-symbols-outlined" style="font-size: 1em"> thumb_up </span>
                <span style="font-size: 1em; margin-left: 10%">按讚</span>
              </v-btn>
              <v-btn
                class="bg-green"
                style="width: auto; height: 80%; font-size: 0.8em; margin-left: 10px"
                >加入聊天室</v-btn
              >
            </span>
          </span>

          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              height: 40%;
              margin-bottom: 10px;
            "
          >
            <img
              src="https://i.imgur.com/pJziasF.jpeg"
              alt="test"
              style="width: 15%; height: auto; max-height: 100%"
            />
            <span style="width: 80%; height: 100%; background-color: white; font-size: 1em">{{
              songList[0].something
            }}</span>
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

    <!-- second part -->
    <div
      class="flexColumn"
      style="width: 100%; height: 25%; justify-content: space-around; max-width: 1200px"
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          padding-left: 5%;
          padding-right: 15%;
          width: 100%;
          height: 40%;
        "
      >
        <v-sheet v-for="n in 4" :key="n" width="22%" height="100%">
          <div
            style="
              display: flex;
              align-items: center;
              width: 100%;
              height: 100%;
              background-color: #adadad;
              padding: 5%;
            "
          >
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                width: 40%;
                height: 100%;
              "
            >
              <img
                src="https://i.imgur.com/pJziasF.jpeg"
                alt="test"
                style="width: auto; height: 100%"
              />
            </div>

            <div style="flex: 1; height: 100%">
              <h5>版主名稱</h5>
              <h6>歌名</h6>
            </div>
          </div>
        </v-sheet>
      </div>

      <div
        style="
          display: flex;
          justify-content: space-between;
          padding-left: 15%;
          padding-right: 5%;
          width: 100%;
          height: 40%;
        "
      >
        <v-sheet v-for="n in 4" :key="n" width="22%" height="100%">
          <div
            style="
              display: flex;
              align-items: center;
              width: 100%;
              height: 100%;
              background-color: #adadad;
            "
          >
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                width: 40%;
                height: 100%;
              "
            >
              <img
                src="https://i.imgur.com/pJziasF.jpeg"
                alt="test"
                style="width: 80%; height: auto; max-height: 80%"
              />
            </div>

            <div>
              <span></span>
            </div>
          </div>
        </v-sheet>
      </div>
    </div>

    <!-- third part -->
    <div
      class="flexColumn"
      style="
        width: 100%;
        height: 40%;
        max-width: 1200px;
        justify-content: space-around;
        padding: 5px;
      "
    >
      <div style="height: 10%">
        <v-btn
          class="bg-green white-text"
          height="100%"
          style="margin-left: 10px; border-radius: 0.8em; font-size: 1em"
        >
          <span class="material-symbols-outlined" style="font-weight: 700; font-size: 0.8em">
            add
          </span>
          <div style="font-size: 0.7em">New Room</div>
        </v-btn>
      </div>

      <div
        style="
          display: flex;
          height: 80%;
          justify-content: left;
          flex-wrap: nowrap;
          overflow-x: auto;
        "
      >
        <SmallUI v-for="n in 5" :key="n" style=""></SmallUI>
      </div>
    </div>
  </html>
</template>

<script lang="ts">
import { reactive } from 'vue'
import Test from './ExportTest.vue'
import SmallUI from './SmallUI.vue'
export default {
  setup(props) {
    props.name

    var songList = reactive([
      {
        songImage: 'ref',
        songTitle: '標題',
        songInfo: '音樂or專輯資訊',
        musicPlayer: '播放者',
        something: '版主留言',
        others: '訪客留言'
      }
    ])

    const test = () => {}
    test

    console.log(songList)

    return { songList }
  },

  components: {
    Test,
    SmallUI
  },
  data() {
    return {
      test1: [
        {
          id: 1,
          name: '1'
        },
        {
          id: 2,
          name: '2'
        }
      ],
      X: '2'
    }
  },
  methods: {
    test() {
      this.list.forEach((element) => {
        console.log(element.first)
        console.log(element.second)
        Test.output()
      })
    }
  },
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
/* default => max-width: 1400px */
/* wrong */
html {
  font-size: 16px;
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
  .flexColumn {
    /* background-color: yellowgreen; */
  }
}
</style>
