import { saveEventData } from "$lib/server/firebase/admin.js";
import { error, json, type Actions } from "@sveltejs/kit";
import type { EventData } from "$lib";

export async function PUT({ request }): Promise<Response> {
  let body: {
    org: string;
    event: string;
    eventData: EventData | undefined;
  } = await request.json();

  if (body && body.org && body.event) {
    return json(await saveEventData(body.org, body.event, body.eventData));
  } else {
    return error(400, "Invalid request");
  }
}
