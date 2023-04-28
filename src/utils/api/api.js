// 攔截器的設置可以讓我們在發出 request 或接到 response 之前做一些事情
// https://ithelp.ithome.com.tw/articles/10230336

import axios from 'axios'
// import UserStatus from "../../stores/UserStatus"

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // const user_status = UserStatus()
    // console.log('測試延遲 api', user_status.authCode)
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
