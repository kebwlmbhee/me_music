import axios from 'axios';
import { defineStore } from 'pinia'

export default defineStore('UserStatus', {
    // data
    state: () => {
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
    // computed
    getters: {
    },
    // methods
    actions: {
        logout() {
            localStorage.removeItem("authCode");
            this.router.replace("/login");
        },
        load_authInfo() {
            const authCode = JSON.parse(localStorage.getItem('authCode'));
            this.authCode.accessToken = authCode.accessToken;
            this.authCode.tokenType = authCode.tokenType;
            this.authCode.expiredIn = authCode.expiredIn;
            this.authCode.state = authCode.state;
        },
        UpdateUser() {
            let url = `${import.meta.env.VITE_API_PATH}/v1/me`;

            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authCode.accessToken}`
                }
            }
            axios.get(url, config)
                .then((res) => {
                    console.log("success");
                    console.log(res);
                    this.userProfile.name = res.data.display_name;
                    this.userProfile.avatar = res.data.images[0].url;
                })
        },
        checkAuth() {
            if (!localStorage.getItem('authCode') || localStorage.getItem('authCode').accessToken === null) {
                this.logout();
            } else {
                this.load_authInfo();
                this.UpdateUser();
            }
        },
    }
})