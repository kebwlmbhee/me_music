<template>
  <v-list>
    <v-list-item v-for="(chat, index) in store.ChatData" :key="index" :subtitle="chat.sender">
      <template v-slot:prepend>
        <v-avatar color="brown">{{ chat.sender[0] }}</v-avatar>
      </template>
      <v-list-item-title class="text-left">{{ chat.content }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
import { useChatDataStore } from '@/stores/chatdata'

export default {
  name: 'ChatRoom',
  setup() {
    const store = useChatDataStore()
    return { store }
  }
}
</script>

<style></style>
