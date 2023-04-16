<template>
  <main>
    <v-btn v-on:click="logout">Logout</v-btn>
    <div>
      <h4> {{ userProfile.name }} </h4>
      <img v-bind:src="userProfile.avatar" alt="">
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import UserStatus from '@/stores/UserStatus';

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  methods: {
    ...mapActions(UserStatus, ['checkAuth', 'logout']),
  },
  mounted() {
    this.checkAuth();
  }
}
</script>