<template>
    <div class="TestContainer">
        <!-- 最上方搜尋按鈕處 -->
        <v-app-bar flat>
            <div class="directionButton">
                <v-btn height="100%" color="white" style="background-color: black;">L</v-btn>
                <v-btn height="100%" color="white" style="background-color: black;">R</v-btn>
            </div>
            <!-- <v-btn class="searchButton" border flat @click="searchItem(searchText, 30, 0 )">歌手</v-btn> -->
            <v-btn class="searchButton" border flat @click="searchItem(searchText, 30, 1 )">歌曲</v-btn>
            <!-- <v-btn class="searchButton" border flat @click="searchItem(searchText, 30, 2 )">播放清單</v-btn> -->
            <v-btn class="searchButton" border flat @click="searchItem(searchText, 30, 3 )">專輯</v-btn>
        </v-app-bar>
        <v-divider color="black"  class="border-opacity-70" inset></v-divider>
        <!-- Title 跟 排序按鈕處 -->
        <v-card flat class="sortCard" >
            <v-card-title class="font-weight-bold text-h3">
                Title <v-icon class="text-h6" color="lightgray" @click="Reload">mdi-reload</v-icon>
            </v-card-title>
            <v-card-actions>
                <v-btn>Last Month</v-btn>  
                <v-btn>Last 6 Months</v-btn>  
                <v-btn>Last Year</v-btn>  
                <v-spacer></v-spacer>
                <v-select label="Sort" variant="underlined"
                    :items="['Test1', 'Test2', 'Test3']"
                >
                </v-select>          
            </v-card-actions>
        </v-card>
        <!-- 歌曲裝載處 -->
        <div class="songContainer overflow-auto">
            <v-sheet v-for="(search , index) in searchResponse" :key="index" height="10%" width="10%" border @click="trigger_pop_up(true,search)">
                <v-img v-if="search.album.images[0].url" :src="search.album.images[0].url"></v-img>
            </v-sheet>
        </div>
        <!-- 彈出視窗 -->
        <div v-if="popUpWindow" class="TestFooter">
            <v-card class="TestCard" color="white" width="100%" height="100%" rounded="0"> 
                <div class="d-flex flex-no-wrap align-center">
                    <v-avatar class="ma-3" size="100" rounded="0">
                        <v-img :src="checkSong.image"></v-img>
                    </v-avatar>
                    <div>
                        <v-card-title>{{checkSong.name}}</v-card-title>
                        <v-card-subtitle>{{checkSong.artists[0].name}}</v-card-subtitle>
                        <v-card-text>Description</v-card-text>
                    </div>
                    <v-spacer></v-spacer>
                    <!-- 應該要放頭像  但沒有ˊˇˋ -->
                    <div style="margin-right: 20px;">
                        <v-avatar v-for="n in checkSong.artists.length" :key="n">
                            <v-img :src="imgSrc"></v-img>
                        </v-avatar>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="white" size="small" style="background-color: green;align-self: flex-end;">點播</v-btn>
                        </v-card-actions>
                    </div>
                    <div style="align-self: flex-start;">
                        <v-icon @click="trigger_pop_up(false)">mdi-chevron-double-down</v-icon>
                    </div>
                </div>
            </v-card>
        </div>
    </div>
</template>

<script>
import UserStatus from '@/stores/UserStatus';
import { mapState, mapActions} from 'pinia';
export default{
    inject:["Reload"],
    data(){
        return{
            test:30,imgSrc:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGQDqS3rBb7GyPj87cxlKGJM1VC3CFIaUBg&usqp=CAU',
            searchText:"W" , searchResponse:[] , popUpWindow:false,
            checkSong:{name:"",image:"",artists:[]}
        }
    },
    computed:{
        ...mapState(UserStatus, ['authCode', 'userProfile']),
    },
    methods:{
        searchItem(query, limit, type ) {
            let url = `https://api.spotify.com/v1/search/?q=${query}&type=track&limit=${limit}`;
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authCode.access_token}`
                }
            };
            this.$http.get(url, config)
                .then((res) => {
                    let data = res.data;
                    this.searchResponse = data.tracks.items
                    // console.log(this.searchResponse)
                })
        },
        trigger_pop_up(up_or_down, data = null){
            console.log(data) //data.album.images 圖片  data.artists[] 歌手 data.name 名稱
            if(!up_or_down) { //不觸發 或是 取消觸發
                this.popUpWindow = false ;
                return;
            }
            //要觸發
            this.popUpWindow = true ;
            this.checkSong = {
                name:data.name,
                image:data.album.images[0].url,
                artists:data.artists
            }
        },
        ...mapActions(UserStatus,['checkAuth'] ),

    },
    mounted(){
        this.checkAuth();
        this.searchItem("w", 30, 0);
    }
}
</script>

<style>
.TestContainer{
    width: 100%;
    height: 100%;
    position: relative;
}
.directionButton{
    height: 100%;
    margin: 15px 0px 0px 10px;
}
.searchButton{
    margin: 15px 10px 0px 10px;
}
.sortCard{
    margin: 5px 10px;
}
.songContainer{
    margin: 5px 15px;
    height: auto;
    max-height: 400px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
}
.TestFooter{
    width: 100%;
    height: 150px;
    position: absolute;
    bottom: 0;

    /* border: solid 1px black; */
}
.TestCard{
    margin: 1px;
}
</style>