<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { MouseEventHandler } from "svelte/elements";

  type ButtonType = "add" | "confirm" | "edit";

  const {
    type,
    onclick,
    class: className,
  }: { type: ButtonType; onclick?: MouseEventHandler<EventTarget>; class?: string } = $props();

  function getIconName() {
    switch (type) {
      case "add":
        return "material-symbols:add-2-rounded";
      case "confirm":
        return "material-symbols:check-rounded";
      case "edit":
        return "material-symbols:edit-outline";
    }
  }
</script>

<button
  class={"flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-700" +
    (className ? " " + className : "")}
  {onclick}
>
  <Icon icon={getIconName()} />
</button>
