<script lang="ts">
  import Header from "./Components/Header.svelte";
  import ScreenNavigator from "./Components/ScreenStackNavigator.svelte";
  import bg from "./assets/Images/bg.png";

  import { SCREENS } from "./Screens";
  import { navStack } from "./store/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    document.documentElement.style.setProperty(
      "--window-height",
      `${window.innerHeight}px`
    );
  });

  window.addEventListener("resize", () => {
    document.documentElement.style.setProperty(
      "--window-height",
      `${window.innerHeight}px`
    );
  });
</script>

<main style="background-image: url({bg});">
  {#if $navStack.slice(-1)[0] !== "LauncherScreen"}
    <Header />
  {/if}
  <ScreenNavigator
    bind:stack={$navStack}
    screenList={SCREENS}
    rootScreenKey="LauncherScreen"
  />
  <!-- Footer: <Header /> -->
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    user-select: none;
    height: 100%;
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
