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
export default {
  data() {
    return {
      authCode: {
        accessToken: '',
        tokenType: '',
        expiredIn: '',
        state: '',
      },
      userProfile: {
        name: '',
        avatar: ''
      }
    }
  },
  methods: {
    checkAuth() {
      if (!localStorage.getItem('authCode') || localStorage.getItem('authCode').accessToken === null) {
        this.logout();
      } else {
        this.load_authInfo();
      }
    },
    logout() {
      localStorage.removeItem("authCode");
      this.$router.replace("/login");
    },
    load_authInfo() {
      const authCode = JSON.parse(localStorage.getItem('authCode'));
      this.authCode.accessToken = authCode.accessToken;
      this.authCode.tokenType = authCode.tokenType;
      this.authCode.expiredIn = authCode.expiredIn;
      this.authCode.state = authCode.state;
    },

    getUser() {
      let url = 'https://api.spotify.com/v1/me';
      let config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authCode.accessToken}`
        }
      }
      this.$http.get(url, config)
        .then((res) => {
          console.log("success");
          console.log(res);
          this.userProfile.name = res.data.display_name;
          this.userProfile.avatar = res.data.images[0].url;
        })
    }
  },
  mounted() {
    this.checkAuth();
    this.getUser();
  }
}
</script>