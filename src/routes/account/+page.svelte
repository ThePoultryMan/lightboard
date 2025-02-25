<script lang="ts">
  import { getUser, signIn } from "$lib/firebase";
  import { sessionData } from "$lib/index.svelte";
  import { onMount } from "svelte";

  // let turnstileLoaded = false;
  let turnstileLoaded = true;

  let email = $state("");
  let password = $state("");

  onMount(() => {
    // TODO: Implement cloudflare turnstile for auth.
    // const script = document.createElement("script");
    // script.type = "text/javascript";
    // script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    // script.async = true;
    // script.addEventListener("load", () => (turnstileLoaded = true), {
    //   once: true,
    // });
    // document.head.appendChild(script);
  });

  async function doAccountAction(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    event.preventDefault();
    sessionData.user = await signIn(email, password);
  }
</script>

{#if sessionData.user}{:else if turnstileLoaded}
  <form onsubmit={(event) => doAccountAction(event)}>
    <input type="email" name="email" id="email" placeholder="jackie@mimic.box" bind:value={email} />
    <input
      type="password"
      name="password"
      id="password"
      placeholder="******"
      bind:value={password}
    />
    <!-- <div class="cf-turnstile" data-sitekey="0x4AAAAAAA-ebc5NnKHefIrN" data-theme="dark"></div> -->
    <button type="submit" value="Submit">Log in</button>
  </form>
{:else}
  <p>loading</p>
{/if}
