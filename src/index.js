import { createApp } from 'vue'


import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, onValue, set, ref, push, remove } from 'firebase/database';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCnoF3pVGktFkrQ1vn6U6k-g8zMifrsFL4",
    authDomain: "memusic-97d9b.firebaseapp.com",
    databaseURL: "https://memusic-97d9b-default-rtdb.firebaseio.com",
    projectId: "memusic-97d9b",
    storageBucket: "memusic-97d9b.appspot.com",
    messagingSenderId: "285609111713",
    appId: "1:285609111713:web:77cb667268d9d2f9b880e0",
    measurementId: "G-G9HCVQN5R9"
});

const db = getDatabase();
const chatroomRef = ref(db, 'chatroom');

const auth = getAuth(firebaseApp);


/*
async function writeData(msg){
    
    push(chatroomRef, {
        message: msg
    })
}

writeData("123");
*/

function readData(){

    onValue(chatroomRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data)
    });
}

readData();

/*
const app = createApp({
    data() {
        return {
            chatroom: [],
            tempUserName: '',
            username: '',
            message: ''
        }
    },
    methods: {

    },
    setup() {
        onValue(chatroomRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data)
            this.chatroom = data;
        });
    }
});

app.mount('#app')

window.Vue = app;

*/