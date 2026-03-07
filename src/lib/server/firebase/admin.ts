import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "$lib/firebase";

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
