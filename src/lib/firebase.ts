import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";

import type { Division, EventData, ScoreCollection, Team } from "./types";

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

export function isSetup() {
    if (!event) {
        return false;
    }
}

export async function getEventData() {
    const divisionQuery = await getDoc(doc(firestore, "events", event));
    return divisionQuery.data() as EventData;
}

export async function getAllTeams() {
    const teamQuery = await getDocs(collection(firestore, "events", event, "teams"));
    const teams: Team[] = [];
    teamQuery.forEach((document) => {
        teams.push(document.data() as Team);
    });

    return teams;
}

export async function getDivisionNames() {
    const divisionQuery = await getDoc(doc(firestore, "events", event));
    const divisions = divisionQuery.data()?.scoring.divisions as Division[];

    return divisions.map((d) => d.name);
}

export async function getScores() {
    const scoresQuery = await getDocs(collection(firestore, "events", event, "scores"));
    const scores: ScoreCollection[] = [];
    scoresQuery.forEach((document) => {
        scores.push(document.data() as ScoreCollection);
    });

    return scores;
}
