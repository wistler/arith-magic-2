<script lang="ts">
  import Screen from "../Components/Screen.svelte";
</script>

<Screen let:navigateTo let:back>
  <div>Settings ...</div>
  <button on:click={back}>Back</button>
</Screen>

<style>
  * {
    margin: 0.25em;
    padding: 0.25em;
  }
</style>
