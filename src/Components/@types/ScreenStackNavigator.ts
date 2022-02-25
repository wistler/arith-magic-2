import type { ScreenKey } from "src/Screens";

export type ScreenStackNavigatorCxt = {
    getCurrentScreenKey: () => ScreenKey;
    navigateTo: (screenKey: ScreenKey) => Promise<boolean>;
    back: () => Promise<boolean>;
};

export const STACK_NAVIGATOR_CXT_KEY = "ScreenStackNavigatorCxtKey";