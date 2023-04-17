<template>
  <div class="chat-container">
    <div class="messages-container" v-if="messages.length > 0">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <div class="message-info">
          <div class="message-author">{{ message.author }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
        <div class="message-text">{{ message.text }}</div>
      </div>
    </div>
    <div class="form-container">
    <form class="message-input" @submit.prevent="sendMessage">
      <input type="text" v-model="author" placeholder="Your name">
      <input type="text" v-model="text" placeholder="Type your message here...">
      <button type="submit">Send</button>
    </form>
    </div>
  </div>
</template>

<script>
import { db } from '../firebaseConf.js';
import { defineComponent } from 'vue';

import Chatroom from '../chatroom.js';

const chatroom = new Chatroom(db);

export default defineComponent({
  data() {
    return {
      author: '',
      text: '',
      messages: []
    }
  },
  created() {
    chatroom.onMessage((messages) => {
      this.messages = messages;
    });
  },
  methods: {
    sendMessage() {
      if (!this.author) {
        alert('Please enter your name!');
        return;
      }
      if (!this.text){
        alert('message is empty!');
        return;
      }
      chatroom.sendMessage(this.author, this.text);
      this.text = '';
    }
  }
});
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messages-container {
  flex: 1;
  overflow-y: scroll;
}
.message {
  font-size: 30px;
  margin: auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.message-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.message-author {
  font-weight: bold;
}
.message-time {
  margin-top: auto; 
  font-size: 20px;
  color: #666;
}
.message-text {
  white-space: pre-wrap;
}
.message-input {
  display: flex;
  align-items: center;
  margin-top: 30%;
  padding: 10px;
  border-top: 1px solid #ccc;
}
.message-input input {
  width: 150%;
  height: 40px;
  font-size: 1.3rem;
  margin-right: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.message-input button {
  width: 10%;
  height: 45px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
.message-input button:hover{
  background-color: rgb(92, 153, 243);
  color: white;
}
input::placeholder{
  font-size: 20px;
}
.form-container {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
