<template>
  <div>
    <h1>Announcements:</h1>
    <div class="announcement-container" v-if="announcements.length > 0">
      <ul>
        <li v-for="(announcement, index) in announcements" :key="index">
          <div class="announcement-author">Author: {{ announcement.author }}</div>
          <div class="announcement-text">Content: {{ announcement.text }}</div>
          <div class="announcement-time">Time: {{ chatroom.getTimeString(announcement.time) }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Chatroom from '/src/views/chatroom/chatroom.js';
import { db } from '/src/firebaseConf.js';
import { defineComponent } from 'vue';

const chatroom = new Chatroom(db);

export default defineComponent({
  data() {
    return {
      announcements: []
    };
  },
  // must wait until getAnnouncement
  created() {
    new Promise((resolve) => {
      chatroom.onAnnouncement((messages) => {
        this.announcements = messages;
        resolve(this.announcements);
      });
    });
  },
  mounted() {
    this.chatroom = chatroom;
  }
})
</script>

<style scoped>

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  margin: 0 auto;
  max-width: 50%;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  padding: 1rem;
}

.announcement-author {
  font-weight: bold;
  font-size: 16px;
}

.announcement-time {
  font-size: 16px;
  color: #999;
  align-self: flex-end;
}

.announcement-text {
  font-size: 20px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
