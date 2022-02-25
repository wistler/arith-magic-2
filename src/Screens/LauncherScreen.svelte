<script lang="ts">
  import Screen from "../Components/Screen.svelte";
  import bg from "../assets/Images/bg_2x.jpg";
  import logo from "../assets/Images/arithmagic.png";
</script>

<Screen let:navigateTo props={{ bgImageURL: bg }}>
  <img src={logo} alt="ArithMagic Logo" class="logo" />
  <div class="menu">
    <div>Main Menu</div>
    <button on:click={() => navigateTo("SelectionScreen")}>Play</button>
    <button on:click={() => navigateTo("SettingsScreen")}>Settings</button>
  </div>
</Screen>

<style>
  .logo,
  .menu {
    align-self: center;
    max-width: 50%;
    flex: 1;
    object-fit: contain;
    object-position: bottom;
  }
</style>
