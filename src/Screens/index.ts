import _ from "lodash";
import GameScreen from "./GameScreen.svelte";
import LauncherScreen from "./LauncherScreen.svelte";
import SelectionScreen from "./SelectionScreen.svelte";
import SettingsScreen from "./SettingsScreen.svelte";


export const Screens = {
    LauncherScreen,
    SelectionScreen,
    GameScreen,
    SettingsScreen
}

export type ScreenKey = keyof typeof Screens

export const SCREENS = _.keys(Screens).map(key => ({ key, screen: Screens[key] }));

