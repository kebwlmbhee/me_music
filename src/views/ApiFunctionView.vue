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
                    <img v-bind:src="item.images[1].url" alt="">
                </li>
            </ul>
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
                    // console.log(res)
                })
        }
    },
    mounted() {
        this.checkAuth();
    }
}
</script>