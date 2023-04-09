import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyAyWnsGeIBUlVxCZlJJmld4nvlwPqRXqnc",
  authDomain: "test-project-38b38.firebaseapp.com",
  projectId: "test-project-38b38",
  storageBucket: "test-project-38b38.appspot.com",
  messagingSenderId: "949026698233",
  appId: "1:949026698233:web:bb77d5f270e33e39ce4328",
});

export var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});
export const auth = firebase.auth();

export default firebase;
