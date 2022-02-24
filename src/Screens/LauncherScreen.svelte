<script lang="ts">
  import Screen from "../Components/Screen.svelte";
</script>

<Screen let:navigateTo>
  <div>Main Menu</div>
  <button on:click={() => navigateTo("SelectionScreen")}>Play</button>
  <button on:click={() => navigateTo("SettingsScreen")}>Settings</button>
</Screen>

<style>
</style>
