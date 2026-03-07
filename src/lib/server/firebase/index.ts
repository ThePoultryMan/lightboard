import {
  type UserCredential,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { emptyEvent, type EventData, type EventMetaData, type TeamData } from "$lib";
import { sortByIndex } from "$lib/util";
import { getFirebaseApp } from "$lib/firebase";

export interface User extends UserCredential {
  error: string | undefined;
}

export async function getEventDisplayName(org: string, event: string): Promise<string> {
  const firestore = getFirestore(getFirebaseApp());
  const collectionPath = `/orgs/${org}/${event}`;

  const meta = (await getDoc(doc(firestore, collectionPath, "meta"))).data() as EventMetaData;
  return meta.displayName ? meta.displayName : "";
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
