import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";

import {
  PUBLIC_API_KEY,
  PUBLIC_APP_ID,
  PUBLIC_AUTH_DOMAIN,
  PUBLIC_MESSAGE_SENDER_ID,
  PUBLIC_PROJECT_ID,
  PUBLIC_STORAGE_BUCKET,
} from "$env/static/public";
import { getAuth as getFirebaseAuth, signInWithEmailAndPassword, type Auth, type UserCredential } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { emptyEvent, type Event, type EventMetaData, type TeamData } from "$lib";
import { sortByIndex } from "$lib/util";

export interface User extends UserCredential {
  error: string | undefined;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: PUBLIC_API_KEY,
  authDomain: PUBLIC_AUTH_DOMAIN,
  projectId: PUBLIC_PROJECT_ID,
  storageBucket: PUBLIC_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_MESSAGE_SENDER_ID,
  appId: PUBLIC_APP_ID,
};
let firebaseApp: FirebaseApp | undefined;
let auth: Auth;
let user: User | undefined;

export function getFirebaseApp() {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
    return firebaseApp;
  } else {
    return firebaseApp;
  }
}

function getAuth() {
  getFirebaseApp();
  return getFirebaseAuth(firebaseApp);
}

export function getUser() {
  return getAuth().currentUser;
}

export async function getEventData(org: string, event: string) {
  const firestore = getFirestore(getFirebaseApp());
  const collectionPath = `/orgs/${org}/${event}`;

  let eventData = emptyEvent();
  eventData.metaData = (
    await getDoc(doc(firestore, collectionPath, "meta"))
  ).data() as EventMetaData;
  sortByIndex(eventData.metaData.sections);
  sortByIndex(eventData.metaData.divisions);

  let collectionReference = collection(firestore, collectionPath);
  let teamQuery = query(collectionReference, where("__name__", "!=", "meta"));
  (await getDocs(teamQuery)).forEach((document) => {
    eventData.teams.push(document.data() as TeamData);
  });

  return eventData;
}

export async function signIn(email: string, password: string) {
  if (!user) {
    getFirebaseApp();
    auth = getAuth();

    user = (await signInWithEmailAndPassword(auth, email, password)) as User;
    return user;
  } else {
    return user;
  }
}
