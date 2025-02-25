import { TURNSTILE_SECRET_KEY } from "$env/static/private";
import { signInOrUp as signInOrUp } from "$lib/index.server";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.formData();

  const token = body.get("cf-turnstile-response") as FormDataEntryValue;
  const ip = request.headers.get("CF-Connecting-IP") as FormDataEntryValue;

  const email = body.get("email");
  const password = body.get("password");

  let formData = new FormData();
  formData.append("secret", TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    body: formData,
    method: "POST",
  });

  const outcome = await result.json();
  if (!outcome.success || !email || !password) {
    return json({
      succeeded: false,
      error: "Not authorized",
      message: "Turnstile token was not valid",
    });
  } else {
    const user = await signInOrUp(email.toString(), password.toString());

    return json({
      succeeded: true,
      user,
    });
  }

};
