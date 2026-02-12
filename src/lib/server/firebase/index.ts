import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";

import {
  PRIVATE_API_KEY,
  PRIVATE_APP_ID,
  PRIVATE_AUTH_DOMAIN,
  PRIVATE_MESSAGE_SENDER_ID,
  PRIVATE_PROJECT_ID,
  PRIVATE_STORAGE_BUCKET,
} from "$env/static/private";
import {
  getAuth as getFirebaseAuth,
  signInWithEmailAndPassword,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { emptyEvent, type EventData, type EventMetaData, type TeamData } from "$lib";
import { sortByIndex } from "$lib/util";

export interface User extends UserCredential {
  error: string | undefined;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: PRIVATE_API_KEY,
  authDomain: PRIVATE_AUTH_DOMAIN,
  projectId: PRIVATE_PROJECT_ID,
  storageBucket: PRIVATE_STORAGE_BUCKET,
  messagingSenderId: PRIVATE_MESSAGE_SENDER_ID,
  appId: PRIVATE_APP_ID,
};
let firebaseApp: FirebaseApp | undefined;

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

export async function getEventData(org: string, event: string): Promise<EventData> {
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

export async function signIn(email: string, password: string): Promise<User> {
  getFirebaseApp();
  const auth = getAuth();

  return (await signInWithEmailAndPassword(auth, email, password)) as User;
}
