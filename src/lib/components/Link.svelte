<script lang="ts">
  import type { Snippet } from "svelte";

  let { children, href, target }: { children: Snippet; href: string; target?: string } = $props();
</script>

<a
  {href}
  rel={"noopener" + (target === "_blank" ? " noreferrer" : "")}
  target={target ? target : undefined}
>
  {@render children()}
</a>
