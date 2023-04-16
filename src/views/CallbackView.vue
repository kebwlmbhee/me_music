<template>
    <div></div>
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
        ...mapState(UserStatus, ['authCode'])
    },
    methods: {
        ...mapActions(UserStatus, ['UpdateUser']),

        getTokenURL() {
            const fullUrl = window.location.href
            const queryString = fullUrl.replace(import.meta.env.VITE_REDIRECT_URI + '#', '?')
            const urlParams = new URLSearchParams(queryString)
            this.authCode.accessToken = urlParams.get('access_token')
            this.authCode.tokenType = urlParams.get('token_type')
            this.authCode.expiredIn = urlParams.get('expires_in')
            this.authCode.state = urlParams.get('state')
        },
        setTokenLocal(){
            localStorage.setItem("authCode", JSON.stringify(this.authCode));
        },
    },
    mounted() {
        this.getTokenURL();
        this.setTokenLocal();
        this.$router.replace('/');
    }
}

</script>