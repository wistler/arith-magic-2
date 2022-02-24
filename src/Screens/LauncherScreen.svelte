<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import Screen from "../Components/Screen.svelte";
  import bg from "../assets/Images/bg_2x.jpg";
  import logo from "../assets/Images/arithmagic.png";
</script>

<Screen let:navigateTo props={{ bgImageURL: bg }}>
  <img
    transition:fly
    class="logo"
    src={logo}
    alt="ArithMagic Logo"
    width="60%"
    style="align-self: center;"
  />
  <h1>Main Menu</h1>
  <button on:click={() => navigateTo("SelectionScreen")}>Play</button>
  <button on:click={() => navigateTo("SettingsScreen")}>Settings</button>
</Screen>

<style>
  * {
    margin: 0.25em;
    padding: 0.25em;
  }

  .logo {
    animation: floater 5s ease-in-out infinite alternate;
  }

  @keyframes floater {
    0% {
    }
    100% {
      transform: translateY(-10px);
    }
  }
</style>
