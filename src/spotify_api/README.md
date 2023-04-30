# finished-spotify-api

current user’s playlists：當前 user 的所有播放清單

Playlist tracks：輸入 playlist id 得到 playlist 裡面的音樂

current user’s top tracks (10tracks, medium time)

current user’s top artists (3 artists, medium time)

current user’s recent played tracks (limit = 20) (max=50)

Search

User id & name

Player function

#

## Api 使用範例請見 ApiFunctionView.vue 或是 TemplateView.vue

#

### 資料格式:
目前把整理資料格式的function寫在 SpotifyApi.js 內, 供 SpotifyApi.vue 內部的methods呼叫  
資料使用一般的object，沒有特別定義class
#### artist 
{  
name          : String  
image         : String  
id            : String  
}  
#### track 
{  
album_name    : String  
name          : String  
artists       : []  (artist)  
image         : String  
preview_url   : String  
id            : String  
duration_ms   : Int  
}  
#### album 
{  
name          : String  
artists       : []  (artist)  
image         : String  
id            : String  
duration_ms   : Int  
type          : String  
items         : []  (track)  
}  
#### playlist 
{  
name          : String  
artists       : []  (artist)  
image         : String  
id            : String  
duration_ms   : Int  
type          : String  
description   : String  
items         : []  (track)  
}  