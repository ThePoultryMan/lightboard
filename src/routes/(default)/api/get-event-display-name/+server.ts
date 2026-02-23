import { getEventDisplayName } from "$lib/server/firebase/index.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ url }): Promise<Response> {
  const org = url.searchParams.get("org");
  const event = url.searchParams.get("event");

  if (org && event) {
    return json(await getEventDisplayName(org, event));
  } else {
    return error(404, "Event does not exist");
  }
}
