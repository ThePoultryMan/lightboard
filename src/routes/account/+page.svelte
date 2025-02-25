<script lang="ts">
  import { onMount } from "svelte";

  let turnstileLoaded = false;

  onMount(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.addEventListener("load", () => (turnstileLoaded = true), {
      once: true,
    });
    document.head.appendChild(script);
  });
</script>

{#if turnstileLoaded}
  <form action="/api/auth/log-in" method="POST">
    <input type="email" name="email" id="email" placeholder="jackie@mimic.box" />
    <input type="password" name="password" id="password" placeholder="******" />
    <div class="cf-turnstile" data-sitekey="0x4AAAAAAA-ebc5NnKHefIrN" data-theme="dark"></div>
    <button type="submit" value="Submit">Log in</button
    >
  </form>
{:else}
  <p>loading</p>
{/if}
