<script lang="ts">
  import { isDarkMode } from "../store/profile";
  import type { TileHiliteType } from "../store/game";

  export let outlined: boolean = false;
  export let negative: boolean = false;
  export let inactive: boolean = false;
  export let hilite: TileHiliteType = "normal";
  export let flat: boolean = false;
</script>

<div
  class:isDarkMode={$isDarkMode}
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

    --color-positive-number: midnightblue;
    --color-positive-number-bg: rgb(215, 223, 228);
    --color-negative-number: red;
    --color-negative-number-bg: rgb(238, 223, 223);
    --color-hover-bg: white;
    --color-target-bg: greenyellow;
    --color-incorrect: black;
    --color-incorrect-bg: tomato;
    --color-hint-bg: khaki;
    --color-selected-bg: cornflowerblue;
    --color-disabled: grey;
    --color-disabled-bg: lightgray;

    color: var(--color-positive-number);
    background-color: var(--color-positive-number-bg);

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
    color: var(--color-negative-number);
    background-color: var(--color-negative-number-bg);
  }

  div:not(.disabled):not(.selected):not(.inactive):not(.target):not(.incorrect):hover {
    background-color: var(--color-hover-bg);
    transform: translate3d(-0.1em, -0.1em, 0);
    box-shadow: 12px 12px 20px rgba(0, 0, 0, 0.5);
    transition: all 50ms ease-out;
  }

  div.target {
    background-color: var(--color-target-bg);
  }

  div.incorrect {
    color: var(--color-incorrect);
    background-color: var(--color-incorrect-bg);
  }

  div.hint {
    background-color: var(--color-hint-bg);
  }

  /* div:not(.disabled):active, */
  div.selected {
    background-color: var(--color-selected-bg);
    transform: translate3d(0, 0, 0);
    /* box-shadow: 2px 2px 2px rgb(42, 188, 255); */
    /* box-shadow: 2px 2px 10px rgba(0, 0, 0, 1); */
  }

  div.disabled {
    box-shadow: none;
    color: var(--color-disabled);
    background-color: var(--color-disabled-bg);
  }

  div.disabled :global(*) {
    opacity: 30%;
  }

  /* @media (prefers-color-scheme: dark) { */
  div.isDarkMode {
    --color-positive-number: rgb(166, 166, 228);
    --color-positive-number-bg: rgb(48, 75, 92);
    --color-negative-number: rgb(226, 159, 159);
    --color-negative-number-bg: rgb(88, 54, 54);
    --color-hover-bg: rgb(80, 80, 80);
    --color-target-bg: rgb(100, 133, 47);
    --color-incorrect: rgb(255, 255, 255);
    --color-incorrect-bg: rgb(161, 71, 55);
    --color-hint-bg: khaki;
    --color-selected-bg: rgb(57, 85, 138);
    --color-disabled: rgb(172, 172, 172);
    --color-disabled-bg: rgb(99, 99, 99);
  }
  /* } */
</style>
