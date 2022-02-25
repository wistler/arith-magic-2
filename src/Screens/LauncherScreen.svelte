<script lang="ts">
  import WhiteButton from "../Components/WhiteButton.svelte";

  import { fly, fade } from "svelte/transition";
  import Screen from "../Components/Screen.svelte";
  import logo from "../assets/Images/arithmagic.png";
</script>

<Screen let:navigateTo {...$$restProps}>
  <img
    data-animation
    transition:fly
    class="logo"
    src={logo}
    alt="ArithMagic Logo"
    style="align-self: center;"
  />
  <div class="menu">
    <h1>Main Menu</h1>
    <WhiteButton on:click={() => navigateTo("SelectionScreen")}>
      Play
    </WhiteButton>
    <WhiteButton on:click={() => navigateTo("SettingsScreen")}>
      Settings
    </WhiteButton>
  </div>
  <spacer />
</Screen>

<style>
  * {
    margin: 0.25em;
    /* padding: 0.25em; */
  }

  .logo,
  .menu {
    align-self: center;
    flex: 1;
  }

  spacer {
    flex: 0.2;
  }

  .menu {
    display: flex;
    flex-direction: column;
  }

  .logo {
    width: 10em;
    max-width: 80%;
    object-fit: contain;
    object-position: bottom;
    animation: floater 5s ease-in-out infinite alternate;
  }

  @keyframes floater {
    0% {
      filter: drop-shadow(5px 5px 5px #222);
    }
    100% {
      filter: drop-shadow(25px 25px 15px #222);
      transform: translateY(-4%);
    }
  }
</style>
