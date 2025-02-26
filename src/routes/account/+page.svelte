<script lang="ts">
  import Link from "$components/Link.svelte";
  import { signIn } from "$lib/firebase";
  import { getUserInfo, type UserInfo } from "$lib/firebase/admin";
  import { sessionData } from "$lib/index.svelte";
  import { onMount } from "svelte";

  // let turnstileLoaded = false;
  let turnstileLoaded = true;

  let email = $state("");
  let password = $state("");

  let currentUserInfo: Promise<UserInfo> = $derived.by(async () => {
    if (sessionData.user) {
      return await getUserInfo(sessionData.user.user.uid);
    } else {
      return {
        admins: [],
      };
    }
  });

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

  async function doAccountAction(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
  ) {
    event.preventDefault();
    sessionData.user = await signIn(email, password);
  }
</script>

{#if sessionData.user}
  <h1 class="mb-5 text-2xl font-semibold">Welcome, {sessionData.user.user.displayName}</h1>
  <h2 class="mb-2 text-xl">Your Events:</h2>
  <div class="flex">
    {#await currentUserInfo then adminInfo}
      {#each adminInfo.admins as fullEventPath}
        <Link href={`/admin/${fullEventPath}`}>
          <div class="rounded-md bg-neutral-800 p-2.5">{fullEventPath}</div>
        </Link>
      {/each}
    {/await}
  </div>
{:else if turnstileLoaded}
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
