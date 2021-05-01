import firebase from "firebase"

const app = firebase.initializeApp({
    apiKey: "AIzaSyDxOzAipDTwJL6o8jECdiHlbBU191ItvhE",
    authDomain: "react-auth-redux-firebas-d64c3.firebaseapp.com",
    projectId: "react-auth-redux-firebas-d64c3",
    storageBucket: "react-auth-redux-firebas-d64c3.appspot.com",
    messagingSenderId: "761659230204",
    appId: "1:761659230204:web:6f33af6dab01f0ec761479",
    measurementId: "G-ZXY74XP3W6"
});

const db = app.firestore();
const auth = app.auth();

export { db, auth };