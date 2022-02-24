<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  const dispatch = createEventDispatcher();

  const overBlanket = writable(false);
</script>

<blanket
  in:fade
  out:fade={{ delay: 250, duration: 400 }}
  on:mouseenter={() => ($overBlanket = true)}
  on:mouseleave={() => ($overBlanket = false)}
  on:click={() => {
    if ($overBlanket) dispatch("dismiss");
  }}
>
  <popup
    on:mouseenter={() => ($overBlanket = false)}
    on:mouseleave={() => ($overBlanket = true)}
    in:fly={{ y: 50, delay: 250, duration: 200 }}
    out:fly={{ y: 50, delay: 0 }}
  >
    <slot />
  </popup>
</blanket>

<style>
  blanket {
    position: absolute;
    background-color: rgba(#000000, 0.8);

    user-select: none;
    height: 100%;
    width: 100%;
    overflow: hidden;

    text-align: center;
    margin: 0 auto;

    display: grid;
    grid-template-columns: auto minmax(40%, auto) auto;
    grid-template-rows: auto minmax(20%, auto) auto;
    align-items: center;
    justify-content: space-between;
  }

  popup {
    grid-row: 2;
    grid-column: 2;
    background-color: white;
    border: 1px solid black;
    border-radius: 1em;

    padding: 0 5% 10% 5%;
  }
</style>
