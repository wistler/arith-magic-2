<script lang="ts">
  import Header from "./Components/Header.svelte";
  import ScreenNavigator from "./Components/ScreenStackNavigator.svelte";
  import bg from "./assets/Images/bg_2x.jpg";

  import { SCREENS } from "./Screens";
  import { navStack } from "./store/navigation";
</script>

<main style="background-image: url({bg});">
  <Header />
  <ScreenNavigator
    bind:stack={$navStack}
    screenList={SCREENS}
    rootScreenKey="LauncherScreen"
  />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    user-select: none;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    text-align: center;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>
