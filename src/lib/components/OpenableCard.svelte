<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { Snippet } from "svelte";

  let {
    children,
    class: className,
    "start-open": startOpen = false,
    "min-height": minHeight = "1.5rem",
  }: {
    children: Snippet;
    class?: string;
    "start-open"?: boolean;
    "min-height"?: string;
  } = $props();

  let open = $state(startOpen);
</script>

<div class={"flex w-full items-start gap-2" + (className ? " " + className : "")}>
  <button class="mt-1 ml-1" onclick={() => (open = !open)}>
    <Icon
      icon="material-symbols:arrow-forward-ios-rounded"
      class={"transition" + (open ? " -rotate-90" : " rotate-90")}
    />
  </button>
  <div
    class="interpolate-keywords w-full overflow-hidden transition"
    style={`height: ${open ? "auto" : minHeight};`}
  >
    {@render children()}
  </div>
</div>

<style>
  .interpolate-keywords {
    interpolate-size: allow-keywords;
  }
</style>
