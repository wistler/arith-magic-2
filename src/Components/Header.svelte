<script lang="ts">
  import { isDarkMode } from "../store/profile";

  $: count = 3;
  const increment = () => {
    count += 2;
  };
</script>

<header class:isDarkMode={$isDarkMode}>ArithMagic</header>

<style>
  header {
    width: 100%;
    padding: 1em;
    /* font-size: 1em; */
    background-color: rgba(255, 255, 255, 0.3);
    color: black;
  }

  /* @media (prefers-color-scheme: dark) { */
  header.isDarkMode {
    background-color: rgba(0, 0, 0, 0.3);
    color: #ccc;
  }
  /* } */

  /* @media (prefers-color-scheme: light) { */
  header {
    background-color: rgba(255, 255, 255, 0.3);
  }
  /* } */
</style>
