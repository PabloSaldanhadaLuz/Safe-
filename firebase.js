import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    where,
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBHrUzvdDXZZSLAY_5XzgPYGTyCmAho1-Y",
    authDomain: "safeplus-cristorei.firebaseapp.com",
    projectId: "safeplus-cristorei",
    storageBucket: "safeplus-cristorei.firebasestorage.app",
    messagingSenderId: "786291923328",
    appId: "1:786291923328:web:8c1d5def2483a9ecd80965"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

console.log("Firebase conectado!");

export {
    db,
    auth,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    where,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    doc,
    setDoc,
    getDoc,
    updateDoc
};