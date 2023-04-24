import { db, ref, push, onValue, remove, set } from '/src/firebaseConf.js'

class musicQueue {
  constructor() {
    this.musicQueueRef = ref(db, 'musicQueue')
  }

  addMusic(artist, songName, url) {
    // push(this.musicQueueRef, newMusic);
    const musicRef = push(ref(db, '/musicQueue'))
    const musicId = musicRef.key

    const newMusic = {
      artist: artist,
      song: songName,
      url: url,
      id: musicId
    }
    set(musicRef, newMusic)
  }

  removeMusic(music) {
    remove(ref(db, `/musicQueue/${music.id}`)).catch((error) => console.error(error))
  }

  onMusic(callback) {
    onValue(this.musicQueueRef, (snapshot) => {
      const musics = []
      snapshot.forEach((childSnapshot) => {
        musics.push(childSnapshot.val())
      })
      if (typeof callback === 'function') {
        callback(musics)
      }
    })
  }
}

export default musicQueue
