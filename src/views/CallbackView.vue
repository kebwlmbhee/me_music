<template>
    <div></div>
</template>
<script>
export default {
    data() {
        return {
            authorize: {
                accessToken: '',
                tokenType: '',
                expiredIn: '',
                state: ''
            }
        }
    },
    methods: {
        getTokenURL() {
            const fullUrl = window.location.href
            const queryString = fullUrl.replace(import.meta.env.VITE_REDIRECT_URI + '#', '?')
            const urlParams = new URLSearchParams(queryString)
            this.authorize.accessToken = urlParams.get('access_token')
            this.authorize.tokenType = urlParams.get('token_type')
            this.authorize.expiredIn = urlParams.get('expires_in')
            this.authorize.state = urlParams.get('state')
        },
        setTokenLocal(){
            localStorage.setItem("authCode", JSON.stringify(this.authorize));
        }
    },
    mounted() {
        this.getTokenURL();
        this.setTokenLocal();
        this.$router.replace('/');

        // let url = new URL(window.location.href.toString());
        // let params = url.searchParams;
        // let code = '';
        // let client_id = import.meta.env.VITE_CLIENT_ID;
        // let client_secret = import.meta.env.VITE_CLIENT_SECRET;

        // for (let pair of params.entries()) {
        //     if (pair[0] === 'code') {
        //         code = pair[1];
        //     }
        // }
        // console.log(code);
    }
}

</script>