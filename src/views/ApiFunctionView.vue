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
    </main>
</template>

<script>

import { mapState, mapActions } from 'pinia';
import UserStatus from '@/stores/UserStatus';

export default {
    data() {
        return {
            searchText: '',
            searchResponse: [],
            current_track_name: '',
            current_track_img: '',
        }
    },
    computed: {
        ...mapState(UserStatus, ['authCode', 'userProfile'])
    },
    methods: {
        ...mapActions(UserStatus, ['checkAuth', 'logout']),

        searchItem(query, limit, type) {
            let url = `https://api.spotify.com/v1/search/?q=${query}&type=${type}&limit=${limit}`;
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authCode.accessToken}`
                }
            }
            this.$http.get(url, config)
                .then((res) => {
                    let data = res.data;
                    this.searchResponse = data.artists.items;
                })
        },
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
                getOAuthToken: cb => { cb(this.authCode.accessToken); },
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