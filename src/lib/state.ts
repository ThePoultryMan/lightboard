import type { User } from "$lib/server/firebase/index";
import { writable, type Writable } from "svelte/store";

export type EventCode = {
  org: string;
  event: string;
};

export const sessionData: Writable<{
  eventCode?: EventCode;
  user: User | undefined;
}> = writable({ user: undefined });
