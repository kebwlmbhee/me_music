<!-- 這頁不要刪掉，用來 Demo Web Playback API 用的，弄很久，我會忘記怎麼串 -->
<template>
    <main>
        <v-btn v-on:click="logout">Logout</v-btn>
        <router-link to="/">
            <v-btn>Home</v-btn>
        </router-link>

        <h2>API test</h2>
        <div>
            <h4> {{ userProfile.name }} </h4>
            <img v-bind:src="userProfile.avatar" alt="">
        </div>
        <div>
            <v-text-field type="text" label="Label" v-model="searchText"></v-text-field>
            <v-btn v-on:click="searchItem(searchText, 5, 'artist')">Search</v-btn>
            <ul>
                <li v-for="item in searchResponse" v-bind:key="item.id">
                    <p>Artist: {{ item.name }}</p>
                    <img v-bind:src="item.images[2].url" alt="">
                </li>
            </ul>
        </div>

        <div style="margin-top: 20px;">
            <h4 style="margin-bottom: 20px;">Web Playback</h4>
            <img v-bind:src="current_track_img" alt="">
            <p> {{ current_track_name }} </p>
            <v-btn id="togglePrev">Prev</v-btn>
            <v-btn id="togglePlay">Toggle Play</v-btn>
            <v-btn id="toggleNext">Next</v-btn>
        </div>

        <div>
            <h4 style="margin-bottom: 20px;">add Track Queue</h4>
            <v-btn v-on:click="addQueue">Add Queue</v-btn>
        </div>

    </main>
</template>

<script>

import { mapState, mapActions } from 'pinia';
import UserStatus from '@/stores/UserStatus';

export default {
    data() {
        return {
            searchText: '',
            searchResponse: [], //searchItem  可能會有track, artist, playlist，獲取資料可使用item.id, item.name, item.image
            playlists: [],  //getUserPlaylists  會有當前user的所有playlist資訊
            playlistTracks: [], //getPlaylistTracks 會有傳入的playlist id裡面的tracks
            topTracks: [],  //getUserTopTracks  會有當前user最常聽的10首歌曲 (數量與時間段可改動)
            topArtists: [], //getUserTopArtists 會有當前user最常聽的3個歌手 (數量與時間段可改動)
            recentTracks: [],   //getRecentTracks   會有當前user最近聽的20首歌  (數量可改動)
            current_track_name: '',
            current_track_img: '',
        }
    },
    computed: {
        ...mapState(UserStatus, ['authCode', 'userProfile'])
    },
    methods: {
        ...mapActions(UserStatus, ['checkAuth', 'logout']),

        //搜尋功能，query為搜尋內容名字，limit為搜尋數量上限，type可替換成track, artist, playlist
        searchItem(query, limit, type) {
            let url = `https://api.spotify.com/v1/search/?q=${query}&type=${type}&limit=${limit}`;
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authCode.access_token}`
                }
            }
            this.$http.get(url, config)
                .then((res) => {
                    let data = res.data;
                    this.searchResponse = data.artists.items; //搜尋結果會存在searchResponse裡面，可以用item.id, item.name, item.image調用不同內容
                })
        },

        //獲取當前使用者的所有playlist
        getUserPlaylists() {
            let url = 'https://api.spotify.com/v1/me/playlists';
            let config = {
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.authCode.access_token}`
                }
            };
            this.$http.get(url, config)
                .then((res) => {
                    let data = res.data;
                    this.playlists = data.items;    //結果會存在playlists裡面，可以用item.id, item.name, item.image調用不同內容
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        //playlistId為欲獲取的播放清單歌曲的id，傳入播放清單id，獲得該播放清單的所有歌曲
        getPlaylistTracks(playlistId) {
            let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authCode.access_token}`
                }
            }
            this.$http.get(url, config)
                .then((res) => {
                    let data = res.data;
                    this.playlistTracks = data.items;   //結果會存在playlistTracks裡面，可以用item.id, item.name, item.image調用不同內容
                })
        },

        //獲取當前使用者最常聽的x首歌，x = limit
        getUserTopTracks() {
            let url = 'https://api.spotify.com/v1/me/top/tracks';
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authCode.access_token}`
                },
                params: {
                    time_range: 'medium_term', // 指定時間範圍
                    limit: 10 // 指定返回的歌曲數量
                }
            };
            this.$http.get(url, config)
                .then((res) => {
                    let data = res.data;
                    this.topTracks = data.items;    //結果會存在topTracks裡面，可以用item.id, item.name, item.image調用不同內容
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        //獲取當前使用者最常聽的x個歌手，x = limit
        getUserTopArtists() {
            let url = 'https://api.spotify.com/v1/me/top/artists';
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authCode.access_token}`
                },
                params: {
                time_range: 'medium_term', // 指定時間範圍
                limit: 3 // 指定返回的藝術家數量
                }
            };
            this.$http.get(url, config)
                .then((res) => {
                    let data = res.data;
                    this.topArtists = data.items;   //結果會存在topArtists裡面，可以用item.id, item.name, item.image調用不同內容
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        //獲取當前使用者最近聽的x首歌，x = limit
        getRecentTracks() {
            let url = `https://api.spotify.com/v1/me/player/recently-played?limit=20`;
            let config = {
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.authCode.access_token}`
                }
            }
            this.$http.get(url, config)
                .then((res) => {
                let data = res.data;
                this.recentTracks = data.items; //結果會存在recentTracks裡面，可以用item.id, item.name, item.image調用不同內容
                })
        },


        
        // 重要!!! Spotify 的 POST 必須照這個格式寫，改了就不能動，我也不知道為什麼 
        addQueue() {
            let config = {
                method: 'POST',
                url: "https://api.spotify.com/v1/me/player/queue/?uri=spotify:track:3KkXRkHbMCARz0aVfEt68P",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Authorization": `Bearer ${this.authCode.access_token}`
                }
            }
            this.$http(config)
                .then((res) => {
                    console.log(res);
                })
        }
    },
    mounted() {
        this.checkAuth();

        // Web Playback SDK
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(this.authCode.access_token); },
                volume: 0.5
            });

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('initialization_error', ({ message }) => {
                console.error(message);
            });

            player.addListener('authentication_error', ({ message }) => {
                console.error(message);
            });

            player.addListener('account_error', ({ message }) => {
                console.error(message);
            });

            player.addListener('player_state_changed', ({
                track_window: { current_track }
            }) => {
                console.log('Currently Playing', current_track);
                this.current_track_name = current_track.album.name;
                this.current_track_img = current_track.album.images[0].url;
            });

            document.getElementById('togglePlay').onclick = function () {
                player.togglePlay();
            };

            document.getElementById('togglePrev').onclick = function () {
                player.previousTrack();
            };

            document.getElementById('toggleNext').onclick = function () {
                player.nextTrack();
            };

            player.connect();
        };
    }
}
</script>