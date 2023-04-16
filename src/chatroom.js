import { ref, push, onValue } from 'firebase/database';

class Chatroom {
  constructor(db) {
    this.chatroomRef = ref(db, 'chatroom');
  }

  sendMessage(author, text) {
    const newMessage = {
      author: author,
      text: text,
      time: new Date().toLocaleString()
    }
    push(this.chatroomRef, newMessage);
  }
  
  onMessage(callback) {
    onValue(this.chatroomRef, (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push(childSnapshot.val());
      });
      if (typeof callback === 'function') {
        callback(messages);
      }
    });
  }

  getMessages() {
    this.onMessage((messages) => {
      this.messages = messages;
    });
  }
}

export default Chatroom;