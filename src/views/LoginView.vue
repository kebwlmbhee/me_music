<template>
    <v-btn v-on:click="getToken">Login</v-btn>
</template>

<script>
export default {
    data() {
        return {
            authUrl: '',
        }
    },
    methods: {
        generateRandomString(length) {
            let text = '';
            let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        },

        getToken() {
            window.location.href = this.authUrl;
        }
    },
    mounted() {
        const tokenValid = localStorage.getItem('authCode');
        if (tokenValid !== null) { this.$router.replace('/') }
        
        const scope = "streaming user-top-read user-read-email user-read-private";
        const state = this.generateRandomString(16);

        const auth_query_parameters = new URLSearchParams({
            response_type: "token",
            client_id: import.meta.env.VITE_CLIENT_ID,
            scope: scope,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI,
            state: state,
            // show_dialog: true
        })
        this.authUrl = 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString();
    },
}
</script>