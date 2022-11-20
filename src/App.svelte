<script lang="ts">
  import Header from "./Components/Header.svelte";
  import ScreenNavigator from "./Components/ScreenStackNavigator.svelte";
  import bg from "./assets/Images/bg.png";

  import { SCREENS } from "./Screens";
  import { navStack } from "./store/navigation";
  import { onMount } from "svelte";
  import { browserPreferDarkMode, isDarkMode } from "./store/profile";

  if (window.matchMedia("(prefers-color-scheme)").media !== "not all") {
    console.log("🎉 Dark mode is supported");
    function checkDarkMode() {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      console.log({ isDarkMode });
      $browserPreferDarkMode = isDarkMode;
    }
    checkDarkMode();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener("change", checkDarkMode);
    } else {
      mediaQuery.addListener(checkDarkMode);
    }
  }

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

<main class:isDarkMode={$isDarkMode} style="background-image: url({bg});">
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
  /* :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  } */

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

  /* @media (prefers-color-scheme: dark) { */
  main.isDarkMode {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    background-blend-mode: darken;
  }
  /* } */

  /* @media (prefers-color-scheme: light) { */
  main {
    background: white;
    color: #333;
  }
  /* } */
</style>
