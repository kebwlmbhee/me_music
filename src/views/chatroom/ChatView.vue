<template>
  <v-list>
      <div v-for="(message, index) in messages" :key="index" class="text-center">
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
import {useChatDataStore } from '@/stores/chatdata'
import {storeToRefs} from 'pinia' 

import { db } from '../../firebaseConf.js';
import Chatroom from './chatroom.js';
const chatroom = new Chatroom(db);

export default {
  name:"ChatRoom",
  data(){
      return{
          currentTime:Date,
          messages:[]
      }
  },
  created(){
      // 發送時間: messages[].time    發信人: messages[].author  內容: messages[].text
      chatroom.onMessage((messages) => {
          this.messages = messages;
          this.currentTime = messages[0].time
      });

  },methods:{
      checkTime(currentIndex){
          if(currentIndex === 0) return true;
          console.log(this.messages[currentIndex].time);
          console.log(this.messages[currentIndex-1].time);
          if(Math.abs(this.messages[currentIndex].time - this.messages[currentIndex-1].time) > (10 * 60 * 1000 )){
              console.log("true")
              return true;
          }
              
          else return false;
      }
  },
  setup(){
      const store = useChatDataStore()
      const {ChatData} = storeToRefs(store)
      return {store}
  }
}
</script>

<style>

</style>