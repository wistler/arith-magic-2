<script lang="ts">
  import WhiteButton from "../Components/WhiteButton.svelte";
  import Screen from "../Components/Screen.svelte";
  import {
    DarkModeSelectedIcon,
    DarkModeUnselectedIcon,
    ExitSessionIcon,
    LightModeSelectedIcon,
    LightModeUnselectedIcon,
    RefreshIcon,
  } from "../lib/icons";
  import {
    appForcedDarkMode,
    appForcedLightMode,
    browserPreferDarkMode,
    isDarkMode,
    levels,
    resetProgressAvailable,
  } from "../store/profile";
  import { DEFAULT_LEVELS } from "../lib/progression";
</script>

{@debug $isDarkMode}
<Screen let:navigateTo let:back {...$$restProps}>
  <h1><u>Settings</u></h1>
  <div>
    Game Progress<br />
    <WhiteButton
      on:click={() => {
        $levels = DEFAULT_LEVELS;
      }}
      disabled={$resetProgressAvailable}>Reset</WhiteButton
    >
  </div>
  <div>
    Color Scheme<br />
    <WhiteButton
      on:click={() => {
        $appForcedLightMode = true;
        $appForcedDarkMode = false;
      }}
    >
      {#if $appForcedLightMode}
        <LightModeSelectedIcon />
      {:else}
        <LightModeUnselectedIcon />
      {/if}
    </WhiteButton>
    <WhiteButton
      on:click={() => {
        $appForcedDarkMode = true;
        $appForcedLightMode = false;
      }}
    >
      {#if $appForcedDarkMode}
        <DarkModeSelectedIcon />
      {:else}
        <DarkModeUnselectedIcon />
      {/if}
    </WhiteButton>
    <WhiteButton
      on:click={() => {
        $appForcedDarkMode = false;
        $appForcedLightMode = false;
      }}
    >
      <RefreshIcon />
    </WhiteButton>
  </div>
  <br />
  <WhiteButton on:click={back}><ExitSessionIcon /> Back</WhiteButton>
</Screen>

<style>
  * {
    margin: 0.25em;
    padding: 0.25em;
  }
</style>
