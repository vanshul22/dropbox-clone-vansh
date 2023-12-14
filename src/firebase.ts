// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUnL8ZK-JQ6g4X__h5AY6BSO_h6__HQWQ",
    authDomain: "dropbox-clone-vansh.firebaseapp.com",
    projectId: "dropbox-clone-vansh",
    storageBucket: "dropbox-clone-vansh.appspot.com",
    messagingSenderId: "329733275844",
    appId: "1:329733275844:web:121ca0b7d0030303b6c991"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const auth = getAuth(app);
