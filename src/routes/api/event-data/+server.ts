import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { json, type RequestHandler } from "@sveltejs/kit";

import { emptyEvent, type EventMetaData, type TeamData } from "$lib";
import { createFirebaseApp } from "$lib/index.server";
import { sortByIndex } from "$lib/util";

export const GET: RequestHandler = async ({ url }) => {
  const org = url.searchParams.get("org");
  const event = url.searchParams.get("event");

  const firestore = getFirestore(createFirebaseApp());
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

  return json(eventData);
};
