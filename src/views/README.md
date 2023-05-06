# View 介紹 

## 首先是BaseView

這個頁面就是你進入後 外框的部分, 全部都屬於BaseView
左邊分別是導向不同頁面,
左上角的圖片 可以進入大廳

最上方會顯示你處於哪個頁面,而右邊的Button可以登出

最右邊是MusicQueue, Audio的Control到時要刪掉
底下要顯示現在播放啥歌?(考慮)

*然後挺重要的是 Audio 是在這裏播放 所以播放暫停 這邊有Provide 函式*
- PlayPreview
- PausePreview
- AddMusic(這個先不要弄)
## 大廳(不是我做ˊ ˇ ˋ 跳過)

## ExploreView 探索

首先最上面為搜索, 按下Enter即可搜索
接下來為Playlist, Show(電台), Artist(藝人)的推薦
大概就10個 可以調ˊ ˇ ˋ

## MusicRecord 我的音樂記錄
這是負責查詢Spotify這隻帳號的收藏與追蹤
使用Tab進行切換頁面,分別使用
- 歌曲
- 歌手
- 播放清單
- 專輯
如果點擊歌曲則會從底部跳出彈窗,可以進行點播
而其他則會跳到其他頁面。

## chatroom/ChatView 聊天室
這是聊天室, 名字是根據你Spotify帳戶名稱
底下輸入欄可以進行輸入, 按下enter發送

## SearchPage 搜尋頁面
這是從Explore搜索後會到達的頁面, 最上方還是可以進行搜尋
然後會分4個部分
- 歌曲
- 歌手
- 播放清單
- 專輯
除歌曲外都會跳到ExploreSong介面, 
歌曲則是可以通過點擊播放Preview 或是 點擊＞來添加至MusicQueue  

## ExploreSongView 探索歌曲頁面
首先要進去前,必須通過query送兩個值 id, 跟type
type的種類有
- playlist
- album
- artist
id則是其  Mmm   id
目前只能傳送這三種, 所以
然後一樣點擊可以播放PreView
而最右邊的Icon可以加入MusicQueue