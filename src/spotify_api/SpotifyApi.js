// import axios from 'axios'

class SpotifyApi {
  // 部分API回傳的simple artist object沒有image, 需另外傳入
  static artistFormat(artist, image_url = '') {
    // 嘗試從傳入的artist裡面抓image
    if (artist.images && image_url == '') {
      image_url = artist.images.length > 0 ? artist.images[0].url : '' //imamges[0] 大小通常是640x640
    }
    return {
      name: artist.name,
      image: image_url,
      id: artist.id
    }
  }

  // 部分API回傳的simple track object沒有album, 需另外傳入
  static trackFormat(track, album_name = '', image_url = '') {
    // 嘗試從傳入的tracks裡面抓album
    if (track.album) {
      if (image_url == '') {
        image_url = track.album.images.length > 0 ? track.album.images[0].url : '' //imamges[0] 大小通常是640x640
      }
      if (album_name == '') {
        album_name = track.album.name
      }
    }
    let artists = track.artists.map((artist) => this.artistFormat(artist, image_url))
    return {
      album_name: album_name,
      name: track.name,
      artists: artists,
      image: image_url,
      preview_url: track.preview_url,
      id: track.id,
      duration_ms: track.duration_ms
    }
  }

  // 部分API回傳的simple album object沒有tracks, 需另外傳入. 假定傳入的tracks已經處理過資料格式
  static albumFormat(album, tracks = []) {
    let image_url = album.images.length > 0 ? album.images[0].url : ''

    // 嘗試從傳入的album裡面抓tracks
    // 大部分album object沒有完整tracks資料, 所以這段幾乎沒用
    if (album.tracks && tracks == []) {
      tracks = album.tracks.items.map((track) => this.trackFormat(track, album.name, image_url))
    }

    let artists = album.artists.map((artist) => this.artistFormat(artist, image_url)) // 從album內的artist object沒有image
    let total_duration_ms = tracks.reduce((acc, track) => acc + track.duration_ms, 0)
    return {
      name: album.name,
      id: album.id,
      image: image_url,
      artists: artists,
      type: album.album_type,
      duration_ms: total_duration_ms,
      items: tracks
    }
  }

  // 大部分API回傳的simple playlist object沒有tracks, 需另外傳入. 假定傳入的tracks已經處理過資料格式
  static playlistFormat(playlist, tracks = []) {
    let image_url = playlist.images.length > 0 ? playlist.images[0].url : '' // 空的playlist沒有image

    // 嘗試從傳入的playlist裡面抓tracks
    // 大部分playlist object沒有完整tracks資料, 所以這段幾乎沒用
    if (playlist.tracks.items && tracks == []) {
      tracks = playlist.tracks.items.map((item) => {
        let album = item.track.album
        let track_image_url = album.images.length > 0 ? album.images[0].url : ''
        return this.trackFormat(item.track, album.name, track_image_url)
      })
    }

    let playlist_artists = tracks.map((track) => {
      // artist從tracks裡面抓
      return track.artists
    })
    let unique_artists = [...new Set(playlist_artists)]
    //console.log(unique_artists)
    let total_duration_ms = tracks.reduce((acc, track) => acc + track.duration_ms, 0)
    return {
      name: playlist.name,
      id: playlist.id,
      image: image_url,
      artists: unique_artists,
      type: playlist.type,
      description: playlist.description,
      duration_ms: total_duration_ms,
      items: tracks
    }
  }
}

export default SpotifyApi
