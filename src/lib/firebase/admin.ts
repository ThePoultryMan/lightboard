import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getFirebaseApp } from ".";

export type UserInfo = {
  admins: string[];
};

export async function getUserInfo(uid: string) {
  getFirebaseApp();
  const firestore = getFirestore();
  const docReference = await getDoc(doc(firestore, "users", uid));
  return docReference.data() as UserInfo;
}
