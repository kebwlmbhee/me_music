<!-- 這頁不要刪掉，用來 Demo Web Playback API 用的，弄很久，我會忘記怎麼串 -->
<template>
  <main>
    <v-btn v-on:click="logout">Logout</v-btn>
    <router-link to="/">
      <v-btn>Home</v-btn>
    </router-link>

    <h2>API test</h2>
    <div>
      <h4>{{ userProfile.name }}</h4>
      <img v-bind:src="userProfile.avatar" alt="" />
    </div>
    <div>
      <v-text-field type="text" label="Label" v-model="searchText"></v-text-field>
      <v-btn v-on:click="searchItem(searchText, 5, 'playlist', this.authCode.access_token)"
        >Search</v-btn
      >
      <ul>
        <li v-for="item in searchResponse" v-bind:key="item.id">
          <p>Artist: {{ item.name }}</p>
          <img v-bind:src="item.image" alt="" />
        </li>
      </ul>
    </div>

    <div style="margin-top: 20px">
      <h4 style="margin-bottom: 20px">Web Playback</h4>
      <img v-bind:src="current_track_img" alt="" />
      <p>{{ current_track_name }}</p>
      <v-btn id="togglePrev">Prev</v-btn>
      <v-btn id="togglePlay">Toggle Play</v-btn>
      <v-btn id="toggleNext">Next</v-btn>
    </div>

    <div>
      <h4 style="margin-bottom: 20px">add Track Queue</h4>
      <v-btn v-on:click="addQueue">Add Queue</v-btn>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import UserStatus from '@/stores/UserStatus'
import SpotifyApi from './SpotifyApi'
import axios from 'axios'

export default {
  data() {
    return {
      searchText: '',
      searchResponse: [], //searchItem  可能會有tracks, artists, playlists
      playlists: [], //getUserPlaylists  會有當前user的所有playlist資訊
      playlistTracks: [], //getPlaylistTracks 會有傳入的playlist id裡面的tracks
      topTracks: [], //getUserTopTracks  會有當前user最常聽的10首歌曲 (數量與時間段可改動)
      topArtists: [], //getUserTopArtists 會有當前user最常聽的3個歌手 (數量與時間段可改動)
      recentTracks: [], //getRecentTracks   會有當前user最近聽的20首歌  (數量可改動)
      current_track_name: '',
      current_track_img: ''
    }
  },
  computed: {
    ...mapState(UserStatus, ['authCode', 'userProfile'])
  },
  methods: {
    ...mapActions(UserStatus, ['checkAuth', 'logout']),

    // 搜尋功能，query為搜尋內容名字，limit為搜尋數量上限，type可替換成track, artist, album, playlist，回傳目標類型的陣列
    // 因為現在還沒有接getAlbumTracks，搜尋album目前不會回傳完整的資料。ablum.items是空的，albums.duration_ms是0
    // 需要用到 getPlaylistTracks
    // 結果存在 this.searchResponse
    searchItem(query, limit, type, token) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/search/?q=${query}&type=${type}&limit=${limit}&market=TW`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      axios(config)
        .then((res) => {
          let data = res.data
          switch (type) {
            case 'artist':
              this.searchResponse = data.artists.items.map((artist) =>
                SpotifyApi.artistFormat(artist)
              )
              break
            case 'track':
              this.searchResponse = data.tracks.items.map((track) => SpotifyApi.trackFormat(track))
              break
            case 'album':
              this.searchResponse = data.albums.items.map((album) => SpotifyApi.albumFormat(album))
              break
            case 'playlist': {
              const promises = data.playlists.items.map((playlist) => {
                return this.getPlaylistTracks(playlist.id, token)
              })
              Promise.all(promises).then((results) => {
                this.searchResponse = data.playlists.items.map((playlist, index) => {
                  return SpotifyApi.playlistFormat(playlist, results[index])
                })
                console.log(this.searchResponse)
              })
              break
            }
            default:
              console.log('type error in searchItem API method')
              break
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //獲取當前使用者的所有playlist
    // 需要用到getPlaylistTracks()
    // 結果是一個playlist陣列
    // 結果存在this.playlists裡面
    getUserPlaylists(token) {
      let config = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      axios(config)
        .then((res) => {
          let data = res.data
          let promises = data.items.map((playlist) => {
            return this.getPlaylistTracks(playlist.id)
          })
          Promise.all(promises).then((results) => {
            this.playlists = data.items.map((playlist, index) => {
              return SpotifyApi.playlistFormat(playlist, results[index])
            })
            console.log(this.playlists)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //playlistId為欲獲取的播放清單歌曲的id，傳入播放清單id，獲得該播放清單的所有歌曲
    // 會直接被其他取得playlist的method呼叫
    // 結果是一個track陣列
    // 為了讓其他function方便使用，會return結果
    // 同時也把結果存在this.playlistTracks裡面
    getPlaylistTracks(playlistId, token) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=TW`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      return axios(config)
        .then((res) => {
          let data = res.data
          let tracks = data.items.map((item) => {
            if (!item.track) {
              return null
            }
            return SpotifyApi.trackFormat(item.track)
          })
          tracks = tracks.filter((track) => track !== null) // 有些track是null, 這是把它從array裡剔除
          this.playlistTracks = tracks
          return tracks
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //獲取當前使用者最常聽的x首歌，x = limit
    // 結果是一個track陣列
    // 結果會存在this.topTracks裡面
    getUserTopTracks(token) {
      let config = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/top/tracks',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
          time_range: 'medium_term', // 指定時間範圍
          limit: 10 // 指定返回的歌曲數量
        }
      }

      axios(config)
        .then((res) => {
          let data = res.data
          this.topTracks = data.items.map((track) => SpotifyApi.trackFormat(track))
          console.log(this.topTracks)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //獲取當前使用者最常聽的x個歌手，x = limit
    // 結果是一個artist陣列
    // 結果會存在this.topArtists裡面
    getUserTopArtists(token) {
      let config = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/top/artists',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
          time_range: 'medium_term', // 指定時間範圍
          limit: 3 // 指定返回的藝術家數量
        }
      }
      axios(config)
        .then((res) => {
          let data = res.data
          this.topArtists = data.items.map((artist) => SpotifyApi.artistFormat(artist))
          console.log(this.topArtists)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //獲取當前使用者最近聽的x首歌，x = limit
    // 結果是一個track陣列
    // 結果會存在this.recentTracks裡面
    getRecentTracks(token) {
      let config = {
        method: 'GET',
        url: `https://api.spotify.com/v1/me/player/recently-played?limit=20`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      axios(config).then((res) => {
        let data = res.data
        this.recentTracks = data.items.map((item) => SpotifyApi.trackFormat(item.track))
        console.log(this.recentTracks)
      })
    },

    // 重要!!! Spotify 的 POST 必須照這個格式寫，改了就不能動，我也不知道為什麼
    addQueue(token) {
      let config = {
        method: 'POST',
        url: 'https://api.spotify.com/v1/me/player/queue/?uri=spotify:track:3KkXRkHbMCARz0aVfEt68P',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`
        }
      }
      axios(config).then((res) => {
        console.log(res)
      })
    }
  },
  mounted() {
    this.checkAuth()

    // Web Playback SDK
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb) => {
          cb(this.authCode.access_token)
        },
        volume: 0.5
      })

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id)
      })

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id)
      })

      player.addListener('initialization_error', ({ message }) => {
        console.error(message)
      })

      player.addListener('authentication_error', ({ message }) => {
        console.error(message)
      })

      player.addListener('account_error', ({ message }) => {
        console.error(message)
      })

      player.addListener('player_state_changed', ({ track_window: { current_track } }) => {
        console.log('Currently Playing', current_track)
        this.current_track_name = current_track.album.name
        this.current_track_img = current_track.album.images[0].url
      })

      document.getElementById('togglePlay').onclick = function () {
        player.togglePlay()
      }

      document.getElementById('togglePrev').onclick = function () {
        player.previousTrack()
      }

      document.getElementById('toggleNext').onclick = function () {
        player.nextTrack()
      }

      player.connect()
    }
  }
}
</script>
