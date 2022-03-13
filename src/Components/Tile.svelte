<script lang="ts">
  import { scale } from "svelte/transition";
  import type { TileHiliteType } from "../store/game";

  export let outlined: boolean = false;
  export let negative: boolean = false;
  export let inactive: boolean = false;
  export let hilite: TileHiliteType = "normal";
  export let flat: boolean = false;
</script>

<div
  class:outlined
  class:negative
  class:inactive
  class={hilite}
  style="{flat ? 'box-shadow: none' : ''};"
>
  <slot />
</div>

<style>
  div {
    /* padding: 0.25em 0.5em 0.25em 0.5em; */
    aspect-ratio: 1;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    align-items: center;
    justify-content: center;
    contain: content;

    /* TODO : Adjust font-size relative to tile size ?? */
    /* font-size: 0.8em; */
    /* font-size: 80%; */

    color: midnightblue;

    background-color: rgb(215, 223, 228);
    background-size: contain;
    border: none;
    border-radius: 0.3em;
    box-shadow: 10px 10px 25px rgba(0, 0, 0, 0.5);

    transition: all 200ms ease-out;
  }

  div.outlined {
    border: 2px solid rgba(0, 0, 0, 0.7);
    box-sizing: border-box;
  }

  div.negative {
    color: red;
    background-color: rgb(238, 223, 223);
  }

  div:not(.disabled):not(.selected):not(.inactive):not(.target):not(.incorrect):hover {
    background-color: white;
    transform: translate3d(-0.1em, -0.1em, 0);
    box-shadow: 12px 12px 20px rgba(0, 0, 0, 0.5);
    transition: all 50ms ease-out;
  }

  div.target {
    background-color: greenyellow;
  }

  div.incorrect {
    color: black;
    background-color: tomato;
  }

  div.hint {
    background-color: khaki;
  }

  /* div:not(.disabled):active, */
  div.selected {
    background-color: cornflowerblue;
    transform: translate3d(0, 0, 0);
    /* box-shadow: 2px 2px 2px rgb(42, 188, 255); */
    /* box-shadow: 2px 2px 10px rgba(0, 0, 0, 1); */
  }

  div.disabled {
    box-shadow: none;
    background-color: lightgray;
    color: gray;
  }

  div.disabled :global(*) {
    opacity: 30%;
  }
</style>
