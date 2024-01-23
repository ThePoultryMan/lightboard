import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD0_LsObqQ_S0cgpiaAbprJtILOjPiiM4c",
    authDomain: "lightboard-0.firebaseapp.com",
    projectId: "lightboard-0",
    storageBucket: "lightboard-0.appspot.com",
    messagingSenderId: "521315924190",
    appId: "1:521315924190:web:ab5452f1060cb7557aaa4f",
    measurementId: "G-VG9QLHDT7G",
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
