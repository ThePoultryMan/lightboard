import {
  PUBLIC_API_KEY,
  PUBLIC_AUTH_DOMAIN,
  PUBLIC_PROJECT_ID,
  PUBLIC_STORAGE_BUCKET,
  PUBLIC_MESSAGE_SENDER_ID,
  PUBLIC_APP_ID,
} from "$env/static/public";
import type { EventData } from "$lib";
import type { User } from "$lib/server/firebase";
import { type FirebaseOptions, type FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import type { SaveResult } from "$lib/server/firebase/admin";

const firebaseConfig: FirebaseOptions = {
  apiKey: PUBLIC_API_KEY,
  authDomain: PUBLIC_AUTH_DOMAIN,
  projectId: PUBLIC_PROJECT_ID,
  storageBucket: PUBLIC_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_MESSAGE_SENDER_ID,
  appId: PUBLIC_APP_ID,
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

export async function signIn(email: string, password: string): Promise<User> {
  getFirebaseApp();
  const auth = getAuth();
  return (await signInWithEmailAndPassword(auth, email, password)) as User;
}

export async function saveEventData(
  org: string,
  event: string,
  eventData: EventData | undefined,
): Promise<SaveResult> {
  if (eventData) {
    getFirebaseApp();
    const firestore = getFirestore();
    const collectionPath = `/orgs/${org}/${event}`;

    try {
      await setDoc(doc(firestore, collectionPath, "meta"), eventData.metaData);
    } catch (error: any) {
      return {
        saved: false,
        error: error.toString(),
      };
    }
    for (const team of eventData.teams) {
      try {
        await setDoc(doc(firestore, collectionPath, team.meta.id), team);
      } catch (error: any) {
        return {
          saved: false,
          error: error.toString(),
        };
      }
    }

    return {
      saved: true,
    };
  } else {
    return {
      saved: false,
      error: "No event data was provided.",
    };
  }
}
