<script lang="ts">
  import { isDarkMode } from "../store/profile";

  export let disabled: boolean = undefined;
  export let flat: boolean = false;
  export let tight: boolean = false;
</script>

<button
  class:isDarkMode={$isDarkMode}
  {disabled}
  on:click
  style="{flat ? 'box-shadow: none' : ''}; {tight
    ? 'margin: 0; padding: 0.1em;'
    : ''}"><slot /></button
>

<style>
  button {
    padding: 0.25em 0.5em 0.25em 0.5em;

    margin: 0.4em;
    background-color: white;
    border: none;
    border-radius: 0.4em;
    box-shadow: 10px 10px 25px rgba(0, 0, 0, 0.5);

    transition: all 50ms ease-out;
    white-space: nowrap;
    font-size: 1em;
    font-family: unset;
  }

  button:active {
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 1);
  }

  button:disabled {
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
    opacity: 30%;
  }

  /* @media (prefers-color-scheme: dark) { */
  button.isDarkMode {
    background-color: #444;
    box-shadow: 10px 10px 25px rgba(0, 0, 0, 0.5);
    color: #ccc;
  }

  button.isDarkMode:active {
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 1);
  }

  button.isDarkMode:disabled {
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  }
  /* } */
</style>
