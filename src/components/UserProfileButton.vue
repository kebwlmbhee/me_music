<template>
  <v-responsive max-width="258">
    <v-btn size="x-large" rounded="xl" border>
      {{ userName }}
      <template v-slot:prepend>
        <v-avatar color="brown">{{ userName[0] }}</v-avatar>
      </template>

      <v-menu activator="parent">
        <v-list>
          <v-list-item title="Log Out" @click="logout"></v-list-item>
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
    userName: String
  },
  methods: {
    ...mapActions(UserStatus, ['logout'])
  }
}
</script>

<style scoped></style>
