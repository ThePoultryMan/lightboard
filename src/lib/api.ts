// helper functions for api access.

import type { EventData } from "$lib";
import type { SaveResult, UserInfo } from "./server/firebase/admin";

export async function getUserInfo(uid: string): Promise<UserInfo> {
  return (await (
    await fetch(`/api/user_info?uid=${uid}`, {
      method: "GET",
    })
  ).json()) as UserInfo;
}

export async function saveEventData(
  org: string,
  event: string,
  eventData: EventData | undefined,
): Promise<SaveResult> {
  return (
    await fetch("/api/save-event-data", {
      method: "PUT",
      body: JSON.stringify({ org, event, eventData }),
    })
  ).json();
}

export async function getEventData(org: string, event: string): Promise<EventData> {
  return (await fetch(`/api/get-event-data/?org=${org}&event=${event}`)).json();
}
