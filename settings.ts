import { THEMES } from "lib/themes";

export interface DndUIToolkitSettings {
  statePath: string;
  selectedTheme: string;

  // Color variables
  colorBgPrimary: string;
  colorBgSecondary: string;
  colorBgTertiary: string;
  colorBgHover: string;
  colorBgDarker: string;
  colorBgGroup: string;
  colorBgProficient: string;

  colorTextPrimary: string;
  colorTextSecondary: string;
  colorTextSublabel: string;
  colorTextBright: string;
  colorTextMuted: string;
  colorTextGroup: string;

  colorBorderPrimary: string;
  colorBorderActive: string;
  colorBorderFocus: string;

  colorAccentTeal: string;
  colorAccentRed: string;
  colorAccentPurple: string;
}

export const DEFAULT_SETTINGS: DndUIToolkitSettings = {
  statePath: ".dnd-ui-toolkit-state.json",
  selectedTheme: "default",

  ...THEMES.default.colors,
};
