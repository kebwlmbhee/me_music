<template>
  <v-responsive max-width="258">
    <v-btn size="x-large" rounded="xl" border data-test="logout-btn_1">
      {{ userName }}
      <template v-slot:prepend>
        <v-avatar color="brown">
          <v-img :src="userImg" :alt="userName"></v-img>
        </v-avatar>
      </template>

      <v-menu activator="parent">
        <v-list>
          <v-list-item title="Log Out" @click="logout" data-test="logout-btn_2"></v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-responsive>
</template>

<script>
import { mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'

export default {
  name: 'UserProfileButton',
  props: {
    userName: String,
    userImg: String
  },
  methods: {
    ...mapActions(UserStatus, ['logout'])
  }
}
</script>

<style scoped></style>
