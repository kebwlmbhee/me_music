<!-- 麻煩把 -->
<template>
  <main>
    <v-btn v-on:click="logout">Logout</v-btn>
    <router-link to="/api_function">
      <v-btn>API_Function</v-btn>
    </router-link>
    <router-link to="/Home">
      <v-btn>首頁</v-btn>
    </router-link>
    <div>
      <h4>{{ userProfile.name }}</h4>
      <img v-bind:src="userProfile.avatar" alt="" />
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  methods: {
    ...mapActions(UserStatus, ['checkAuth', 'logout'])
  },
  mounted() {
    this.checkAuth()
  }
}
</script>
