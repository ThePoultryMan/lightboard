import { signIn } from "$lib/server/firebase";
import { error, json } from "@sveltejs/kit";

export async function POST({ request }) {
  let body: {
    email: string,
    password: string,
  } = await request.json();

  if (body && body.email && body.password) {
    let response = await signIn(body.email, body.password);
    return json(response);
  } else {
    return error(400, {
      message: "Missing either email or password in request body.",
    });
  }
}
