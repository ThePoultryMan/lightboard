<script lang="ts">
  import Link from "$components/Link.svelte";
  import { getUserInfo } from "$lib/api";
  import { type User } from "$lib/server/firebase";
  import { type UserInfo } from "$lib/server/firebase/admin";
  import { sessionData } from "$lib/state";
  import { onMount } from "svelte";

  // let turnstileLoaded = false;
  let turnstileLoaded = true;

  let email = $state("");
  let password = $state("");

  let user: User | undefined = $state();
  sessionData.subscribe((data) => data.user);
  let userInfo: Promise<UserInfo> = $derived.by(async () => {
    if (user) {
      return await getUserInfo(user.user.uid);
    } else {
      return {
        admins: [],
      };
    }
  });

  $effect(() => {
    sessionData.update((data) => {
      if (user) {
        data.user = user;
      }
      return data;
    });
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
    fetch("/api/signin", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((response) => {
      response.json().then((body) => {
        user = body;
      });
    });
  }
</script>

{#if user}
  <h1 class="mb-5 text-2xl font-semibold">Welcome, {user.user.displayName}</h1>
  <h2 class="mb-2 text-xl">Your Events:</h2>
  <div class="flex">
    {#await userInfo then adminInfo}
      {#each adminInfo.admins as fullEventPath}
        <Link href={`/admin/${fullEventPath}`} class="not-last:mr-5">
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
