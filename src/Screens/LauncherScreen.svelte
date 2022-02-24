<script lang="ts">
  import Screen from "../Components/Screen.svelte";
  import bg from "../assets/Images/bg_2x.jpg";
  import logo from "../assets/Images/arithmagic.png";
</script>

<Screen let:navigateTo props={{ bgImageURL: bg }}>
  <img
    src={logo}
    alt="ArithMagic Logo"
    width="60%"
    style="align-self: center;"
  />
  <div>Main Menu</div>
  <button on:click={() => navigateTo("SelectionScreen")}>Play</button>
  <button on:click={() => navigateTo("SettingsScreen")}>Settings</button>
</Screen>

<style>
</style>
