import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MESSAGE_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from "$env/static/private";
import { createUserWithEmailAndPassword, getAuth, initializeAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
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

export async function signInOrUp(email: string, password: string) {
  getFirebaseApp();
  const auth = getAuth();

  return await createUserWithEmailAndPassword(auth, email, password);
}
