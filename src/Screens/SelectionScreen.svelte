<script lang="ts">
  import Screen from "../Components/Screen.svelte";
  import bg from "../assets/Images/bg_2x.jpg";
</script>

<Screen let:navigateTo let:back props={{ blanketImageURL: bg }}>
  <div>Select a level to play ..</div>
  <button on:click={back}>Back</button>
  <button on:click={() => navigateTo("GameScreen")}>Start</button>
</Screen>

<style>
  * {
    margin: 0.25em;
    padding: 0.25em;
  }
</style>
