<template>
    <div class="TestContainer">
        <!-- 最上方搜尋按鈕處 -->
        <v-app-bar flat>
            <div class="directionButton">
                <v-btn height="100%" color="white" style="background-color: black;">L</v-btn>
                <v-btn height="100%" color="white" style="background-color: black;">R</v-btn>
            </div>
            <v-btn class="searchButton" border flat @click="reload">test</v-btn>
            <v-btn class="searchButton" border flat>test</v-btn>
            <v-btn class="searchButton" border flat>test</v-btn>
            <v-btn class="searchButton" border flat>test</v-btn>
        </v-app-bar>
        <v-divider color="black"  class="border-opacity-70" inset></v-divider>
        <!-- Title 跟 排序按鈕處 -->
        <v-card flat class="sortCard" >
            <v-card-title class="font-weight-bold text-h3">
                Title <v-icon class="text-h6" color="lightgray">mdi-reload</v-icon>
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
            <v-sheet v-for="n in 41" :key="n" height="10%" width="10%" border>
                <v-img :src="imgSrc"></v-img>
            </v-sheet>
        </div>
        <!-- 彈出視窗 -->
        <div class="TestFooter">
            <v-card class="TestCard" color="white" width="100%" height="100%" rounded="0"> 
                <div class="d-flex flex-no-wrap align-center">
                    <v-avatar class="ma-3" size="100" rounded="0">
                        <v-img :src="imgSrc"></v-img>
                    </v-avatar>
                    <div>
                        <v-card-title>Song Name</v-card-title>
                        <v-card-subtitle>Singer Name</v-card-subtitle>
                        <v-card-text>Anoter Text</v-card-text>
                    </div>
                    <v-spacer></v-spacer>

                    <!-- 應該要放頭像  但沒有ˊˇˋ -->
                    <div style="margin-right: 20px;">
                        <v-avatar v-for="n in 5" :key="n">
                            <v-img :src="imgSrc"></v-img>
                        </v-avatar>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="white" size="small" style="background-color: green;align-self: flex-end;">點播</v-btn>
                        </v-card-actions>
                    </div>
                    
                </div>
            </v-card>
        </div>
    </div>
</template>

<script>
import App from '../App.vue';
import {inject} from 'vue'
export default{
    setup(){
        const reload = inject("Reload")
        var songJson = { 
            imageSrc:"",
            ReleastDate:"",
            Artist:"",
        }
        var imgSrc = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGQDqS3rBb7GyPj87cxlKGJM1VC3CFIaUBg&usqp=CAU'
        
        
        return {imgSrc, reload};
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