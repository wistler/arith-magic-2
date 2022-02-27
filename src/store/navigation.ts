import type { ScreenKey } from "src/Screens";
import { persisted } from "../util/persited";

export const navStack = persisted("navStack", [
  "LauncherScreen",
] as ScreenKey[]);
