<script lang="ts" context="module">
  export const SELECTION_SCREEN = "SelectionScreen";
</script>

<script lang="ts">
  import Screen from "../Components/Screen.svelte";
  import WhiteButton from "../Components/WhiteButton.svelte";
  import bg from "../assets/Images/bg_2x.jpg";
</script>

<Screen
  let:navigateTo
  let:back
  props={{ blanketImageURL: bg }}
  {...$$restProps}
>
  <div>Select a level to play ..</div>
  <WhiteButton on:click={() => navigateTo("GameScreen")}>Start</WhiteButton>
  <WhiteButton on:click={back}>Back</WhiteButton>
</Screen>

<style>
  * {
    margin: 0.25em;
    padding: 0.25em;
  }
</style>
