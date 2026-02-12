import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getFirebaseApp } from ".";
import type { EventData } from "$lib";

export type UserInfo = {
  admins: string[];
};
export type SaveResult = {
  saved: boolean;
  error?: string;
};

export async function getUserInfo(uid: string): Promise<UserInfo> {
  getFirebaseApp();
  const firestore = getFirestore();
  const docReference = await getDoc(doc(firestore, "users", uid));
  return docReference.data() as UserInfo;
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
