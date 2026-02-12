import { getUserInfo } from "$lib/server/firebase/admin";
import { error, json } from "@sveltejs/kit";

export async function GET({ url }) {
  let uid = url.searchParams.get("uid");

  if (uid) {
    let response = await getUserInfo(uid);
    return json(response);
  } else {
    return error(400, {
      message: "No 'uid' provided",
    });
  }
}
