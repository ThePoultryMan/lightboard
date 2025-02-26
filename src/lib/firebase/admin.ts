import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getFirebaseApp } from ".";
import type { Event } from "$lib";

export type UserInfo = {
  admins: string[];
};

export async function getUserInfo(uid: string) {
  getFirebaseApp();
  const firestore = getFirestore();
  const docReference = await getDoc(doc(firestore, "users", uid));
  return docReference.data() as UserInfo;
}

export async function saveEventData(org: string, event: string, eventData: Event | undefined) {
  if (eventData) {
    getFirebaseApp();
    const firestore = getFirestore();
    const collectionPath = `/orgs/${org}/${event}`;

    await setDoc(doc(firestore, collectionPath, "meta"), eventData.metaData);
    for (const team of eventData.teams) {
      await setDoc(doc(firestore, collectionPath, team.meta.id), team)
    }

    return true;
  }
}
