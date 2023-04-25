import { db, ref, push, onValue, remove, set, update } from '/src/firebaseConf.js'

class musicQueue {
  constructor() {
    this.musicQueueRef = ref(db, 'musicQueue')
  }

  addMusic(artist, songName, url) {
    // push(this.musicQueueRef, newMusic);
    const musicRef = push(this.musicQueueRef)
    const musicKey = musicRef.key

    const newMusic = {
      artist: artist,
      songName: songName,
      url: url,
      key: musicKey
    }
    set(musicRef, newMusic)
  }

  removeMusic(music) {
    remove(ref(db, `/musicQueue/${music.key}`)).catch((error) => console.error(error))
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

  replaceMusic(firstMusic, targetMusic) {
    this.removeMusic(targetMusic)
    targetMusic.key = firstMusic.key
    update(ref(db, `/musicQueue/${firstMusic.key}`), targetMusic)
  }
}

export default musicQueue
