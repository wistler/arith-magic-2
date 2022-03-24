<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { isDarkMode } from "../store/profile";
  const dispatch = createEventDispatcher();

  const overBlanket = writable(false);
</script>

<blanket
  class:isDarkMode={$isDarkMode}
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
    background-color: rgba(0, 0, 0, 0.8);

    user-select: none;
    height: 100%;
    width: 100%;
    overflow: hidden;

    text-align: center;
    margin: 0 auto;

    /* display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto; */

    display: flex;
    flex-direction: column;
    align-items: center;
    /* align-content: center; */
    justify-content: center;
  }

  popup {
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
    /* border: 1px solid black; */
    border-radius: 0.2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    min-width: 12em;
    max-width: 27em;

    width: 70%;
    height: 70%;
    margin: 0;
    /* padding: 0 5% 10% 5%; */
  }

  /* @media (prefers-color-scheme: dark) { */
  blanket.isDarkMode popup {
    background-color: rgba(61, 61, 61, 0.795);
    color: #ccc;
  }
  /* } */

  /* @media (prefers-color-scheme: light) { */
  popup {
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
  }
  /* } */
</style>
