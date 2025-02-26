<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount, type Snippet } from "svelte";

  let {
    children,
    class: className,
    title = $bindable(),
    titleName,
    titleEditable = false,
  }: {
    children?: Snippet;
    class?: string;
    title?: string;
    titleName?: string;
    titleEditable?: boolean;
  } = $props();
  let div: Element;

  let readOnly = $state(true);
  let editableInputs: HTMLInputElement[] = [];
  let editableSelects: HTMLSelectElement[] = [];
  onMount(() => {
    div.querySelectorAll(":scope input").forEach((element) => {
      editableInputs.push(element as HTMLInputElement);
    });
    div.querySelectorAll(":scope select").forEach((element) => {
      editableSelects.push(element as HTMLSelectElement);
    });
  });

  $effect(() => {
    editableInputs.forEach((element) => {
      let isTitle = title && element.id === "displayName" + title.replaceAll(" ", "");
      if (isTitle) {
        element.readOnly = titleEditable ? readOnly : true;
      } else {
        element.readOnly = readOnly;
      }
    });
    editableSelects.forEach((element) => {
      element.disabled = readOnly;
    });
  });
</script>

<div class={"relative" + (className ? " " + className : "")} bind:this={div}>
  {#if title}
    <div>
      {#if !readOnly && titleEditable}
        <label for={"displayName" + title.replaceAll(" ", "")}>{titleName}: </label>
      {/if}
      <input
        type="text"
        id={"displayName" + title.replaceAll(" ", "")}
        class="editable-input"
        readonly
        bind:value={title}
      />
    </div>
  {/if}
  {#if children}
    {@render children()}
  {/if}
  <button
    class="absolute right-0 bottom-0 z-10 flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-700"
    onclick={() => (readOnly = !readOnly)}
  >
    {#if readOnly}
      <Icon icon="material-symbols:edit-outline" />
    {:else}
      <Icon icon="material-symbols:check-rounded" />
    {/if}
  </button>
</div>
