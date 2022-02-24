<script lang="ts">
  import Screen from "../Components/Screen.svelte";
</script>

<Screen let:navigateTo let:back>
  <div>Select a level to play ..</div>
  <button on:click={back}>Back</button>
  <button on:click={() => navigateTo("GameScreen")}>Start</button>
</Screen>

<style>
</style>
