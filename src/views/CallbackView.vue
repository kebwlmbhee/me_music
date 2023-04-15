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
    }
}

</script>