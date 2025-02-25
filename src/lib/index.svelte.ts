import type { User } from "$lib/firebase/index";

export let sessionData: {
  eventCode?: {
    org: string;
    event: string;
  };
  user: User | undefined;
} = $state({ user: undefined });
