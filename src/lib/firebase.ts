import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

import type { Team } from "./types";

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
export let event: string;

const firestore = getFirestore(app);

export function setUp(evt: string) {
    event = evt;
}

export async function getAllTeams() {
    const teamQuery = await getDocs(collection(firestore, "events", event, "teams"));
    const teams: Team[] = [];
    teamQuery.forEach((document) => {
        teams.push(document.data() as Team);
    });

    return teams;
}
