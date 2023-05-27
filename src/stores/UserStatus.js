import axios from 'axios'
import { defineStore } from 'pinia'

export default defineStore('UserStatus', {
  // 等於 data
  state: () => {
    return {
      authCode: {
        access_token: '',
        expires_in: '',
        refresh_token: '',
        scope: '',
        token_type: ''
      },
      userProfile: {
        name: '',
        avatar: ''
      },
      my_device_id: ''
    }
  },
  // 等於 computed
  getters: {},
  // 等於 methods
  actions: {
    logout() {
      localStorage.removeItem('authCode')
      this.router.replace('/login')
    },
    load_authInfo() {
      const authCode = JSON.parse(localStorage.getItem('authCode'))
      this.authCode.access_token = authCode.access_token
      this.authCode.expires_in = authCode.expires_in
      this.authCode.refresh_token = authCode.refresh_token
      this.authCode.scope = authCode.scope
      this.authCode.token_type = authCode.token_type
    },
    UpdateUser() {
      let self = this
      let url = 'https://api.spotify.com/v1/me'
      let config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authCode.access_token}`
        }
      }
      axios
        .get(url, config)
        .then((res) => {
          this.userProfile.id = res.data.id
          this.userProfile.name = res.data.display_name
          this.userProfile.avatar = res.data.images[0].url
        })
        // 401 Bad or expired token
        .catch((err) => {
          console.log(err)
          self.logout()
        })
    },
    checkAuth() {
      if (
        !localStorage.getItem('authCode') ||
        localStorage.getItem('authCode').access_token === null
      ) {
        this.logout()
      } else {
        this.load_authInfo()
        this.UpdateUser()
      }
    },
    update_device_id(device_id) {
      this.my_device_id = device_id
    }
  }
})
