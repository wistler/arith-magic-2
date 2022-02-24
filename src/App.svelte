<script lang="ts">
  import ScreenNavigator from "./Components/ScreenStackNavigator.svelte";
  import LauncherScreen from "./Screens/LauncherScreen.svelte";
  import SelectionScreen from "./Screens/SelectionScreen.svelte";
  import GameScreen from "./Screens/GameScreen.svelte";
  import SettingsScreen from "./Screens/SettingsScreen.svelte";
  import { SCREENS } from "./Screens/@types";
</script>

<main>
  <ScreenNavigator screenList={SCREENS} rootScreenKey="LauncherScreen" />
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
    justify-content: space-between;
  }
</style>
