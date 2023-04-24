<template>
  <v-list>
      <div v-for="(message, index) in this.allMessages" :key="index" class="text-center">
          <v-label v-if="checkTime(index)">{{ message.time }}</v-label>
          <v-list-item>
              <template v-slot:prepend>
                  <v-avatar color="brown">{{ message.author[0] }}</v-avatar>
              </template>
              <v-list-item-subtitle class="text-left">{{ message.author }}</v-list-item-subtitle>
              <v-list-item-title class="text-left">{{ message.text }}</v-list-item-title>
          </v-list-item>
      </div>
  </v-list>
</template>

<script>
import { mapActions,mapState,mapStores } from 'pinia';
import ChatData from '@/stores/ChatData';

import { db } from '../../firebaseConf.js';
import Chatroom from './chatroom.js';
const chatroom = new Chatroom(db);

export default {
  name:"ChatRoom",
  data(){
      return{
          currentTime:Date,
           text:""
      }
  },
  created(){
      // 發送時間: messages[].time    發信人: messages[].author  內容: messages[].text
    this.GetChatroomMessages();
  },computed:{
    ...mapState[ChatData,["allMessages"]]
  },
  methods:{
      checkTime(currentIndex){
          if(currentIndex === 0) return true;
          if(Math.abs(this.allMessages[currentIndex].time - this.allMessages[currentIndex-1].time) > (10 * 60 * 1000 )){
              console.log("true")
              return true;
          }
              
          else return false;
      },
      ...mapActions(ChatData,["GetChatroomMessages"]),
  }
}
</script>

<style>

</style>