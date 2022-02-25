<script lang="ts">
  import Counter from "../Components/Counter.svelte";
  import Screen from "../Components/Screen.svelte";
  let screenIndex = 0;
</script>

<Screen let:back {...$$restProps}>
  <div>Nice game!</div>
  <button on:click={back}>Back</button>
  <Counter />
</Screen>

<style>
  * {
    margin: 0.25em;
    padding: 0.25em;
  }
</style>
