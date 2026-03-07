// helper functions for api access.
import type { EventData } from "$lib";
import type { UserInfo } from "$lib/server/firebase/admin";

export async function getUserInfo(uid: string): Promise<UserInfo> {
  return (await (
    await fetch(`/api/user_info?uid=${uid}`, {
      method: "GET",
    })
  ).json()) as UserInfo;
}

export async function getEventData(org: string, event: string): Promise<EventData> {
  return (await fetch(`/api/get-event-data/?org=${org}&event=${event}`)).json();
}

export async function getEventDisplayName(org: string, event: string): Promise<string> {
  return (await fetch(`/api/get-event-display-name/?org=${org}&event=${event}`)).json();
}
