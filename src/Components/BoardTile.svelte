<script lang="ts">
  import type { TileHiliteType } from "../store/game";

  export let hilite: TileHiliteType | "selected" | "target" = "normal";
</script>

<div class={hilite}>
  <slot />
</div>

<style>
  div {
    /* padding: 0.25em 0.5em 0.25em 0.5em; */
    /* aspect-ratio: 1/1; */
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    align-items: center;

    /* TODO : Adjust font-size relative to tile size ?? */
    /* font-size: 0.8em; */
    /* font-size: 80%; */

    background-color: white;
    border: none;
    border-radius: 0.3em;
    box-shadow: 10px 10px 25px rgba(0, 0, 0, 0.5);

    transition: all 50ms ease-out;
  }

  div:not(.disabled):not(.selected):hover {
    transform: translate3d(-0em, -0.05em, 0);
    box-shadow: 12px 12px 20px rgba(0, 0, 0, 0.5);
    transition: all 50ms ease-out;
  }

  div.target {
    background-color: greenyellow;
  }

  div.hint {
    background-color: khaki;
  }

  /* div:not(.disabled):active, */
  div.selected {
    background-color: aqua;
    transform: translate3d(0, 0, 0);
    box-shadow: 2px 2px 2px rgb(42, 188, 255);
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
