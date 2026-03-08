export interface ColorTheme {
  name: string;
  colors: {
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
  };
}

export const THEMES: { [key: string]: ColorTheme } = {
  default: {
    name: "Default Dark",
    colors: {
      colorBgPrimary: "#262a36",
      colorBgSecondary: "#323748",
      colorBgTertiary: "#3a4055",
      colorBgHover: "#363b4a",
      colorBgDarker: "#303440",
      colorBgGroup: "#2d334a",
      colorBgProficient: "#2d3343",

      colorTextPrimary: "#e0e0e0",
      colorTextSecondary: "#a0a0d0",
      colorTextSublabel: "#a0c7d0",
      colorTextBright: "#ffffff",
      colorTextMuted: "#b8b8d0",
      colorTextGroup: "#b8c4ff",

      colorBorderPrimary: "#383e54",
      colorBorderActive: "#6d7cba",
      colorBorderFocus: "rgba(109, 124, 186, 0.5)",

      colorAccentTeal: "#64d8cb",
      colorAccentRed: "#e57373",
      colorAccentPurple: "#b39ddb",
    },
  },
  wotc: {
    name: "WOTC/Beyond (Light)",
    colors: {
      colorBgPrimary: "hsl(33, 85%, 95%)",
      colorBgSecondary: "hsl(33, 84%, 90%)",
      colorBgTertiary: "hsl(33, 84%, 85%)",
      colorBgHover: "hsl(33, 84%, 85%)",
      colorBgDarker: "hsl(33, 84%, 80%)",
      colorBgGroup: "hsl(33, 84%, 90%)",
      colorBgProficient: "hsl(36, 100%, 99%)",

      colorTextPrimary: "#000000",
      colorTextSecondary: "#646464",
      colorTextSublabel: "#4f4f4f",
      colorTextBright: "#000000",
      colorTextMuted: "#646464",
      colorTextGroup: "#ba4040",

      colorBorderPrimary: "hsl(30, 100%, 80%)",
      colorBorderActive: "#ba4040",
      colorBorderFocus: "rgba(109, 124, 186, 0.5)",

      colorAccentTeal: "#00c25e",
      colorAccentRed: "#ba4040",
      colorAccentPurple: "#703bbf",
    },
  },

  wotcDark: {
    name: "WOTC/Beyond (Dark)",
    colors: {
      colorBgPrimary: "#1a1a1a",
      colorBgSecondary: "#242424",
      colorBgTertiary: "#2e2e2e",
      colorBgHover: "#2a2a2a",
      colorBgDarker: "#1e1e1e",
      colorBgGroup: "#222222",
      colorBgProficient: "#262626",

      colorTextPrimary: "#d8d0c4",
      colorTextSecondary: "#a09888",
      colorTextSublabel: "#96907c",
      colorTextBright: "#f0e8d8",
      colorTextMuted: "#b0a898",
      colorTextGroup: "#ba4040",

      colorBorderPrimary: "#3a3632",
      colorBorderActive: "#ba4040",
      colorBorderFocus: "rgba(186, 64, 64, 0.5)",

      colorAccentTeal: "#00c25e",
      colorAccentRed: "#ba4040",
      colorAccentPurple: "#703bbf",
    },
  },

  // --- ITS-Theme Companions ---

  itsDndDark: {
    name: "ITS D&D (Dark)",
    colors: {
      // --note: #1a1e24, --code-bg: #222e31, --bg: #1e3831
      colorBgPrimary: "#1a1e24",
      colorBgSecondary: "#222e31",
      colorBgTertiary: "#2c3836",
      colorBgHover: "#1e3831",
      colorBgDarker: "#0e0f15",
      colorBgGroup: "#1c2f2b",
      colorBgProficient: "#2e4d3c",

      // --text: #dcdedd, --soft-text: #aacac9, --headers: #3eb281
      colorTextPrimary: "#dcdedd",
      colorTextSecondary: "#aacac9",
      colorTextSublabel: "#587770",
      colorTextBright: "#ffffff",
      colorTextMuted: "#aacac9",
      colorTextGroup: "#3eb281",

      // --hr: #2b4e41, --accent: #548b67
      colorBorderPrimary: "#2b4e41",
      colorBorderActive: "#548b67",
      colorBorderFocus: "rgba(84, 139, 103, 0.5)",

      // --accent: #548b67 (green heal), --embed-h: #c93c3c (red), --lite-accent: #45b480
      colorAccentTeal: "#45b480",
      colorAccentRed: "#c93c3c",
      colorAccentPurple: "#cc824c",
    },
  },

  itsDndLight: {
    name: "ITS D&D (Light)",
    colors: {
      // --note: #f8fbff, --code-bg: #f1f5ff, --aside-bg: #ecf6f1
      colorBgPrimary: "#f8fbff",
      colorBgSecondary: "#f1f5ff",
      colorBgTertiary: "#ecf6f1",
      colorBgHover: "#dfefe6",
      colorBgDarker: "#cbe2d5",
      colorBgGroup: "#ecf6f1",
      colorBgProficient: "#f1f5ff",

      // --text: #697580, --soft-text: #52ad67, --headers: #0e934c
      colorTextPrimary: "#697580",
      colorTextSecondary: "#52ad67",
      colorTextSublabel: "#48804e",
      colorTextBright: "#1b2c25",
      colorTextMuted: "#91c1ad",
      colorTextGroup: "#0e934c",

      // --hr: #d6deea, --accent: #79c78e
      colorBorderPrimary: "#d6deea",
      colorBorderActive: "#5a8d71",
      colorBorderFocus: "rgba(90, 141, 113, 0.4)",

      // --accent: #79c78e, --embed-h: #c93c3c (still red for damage)
      colorAccentTeal: "#35be89",
      colorAccentRed: "#c93c3c",
      colorAccentPurple: "#cca04c",
    },
  },

  itsWotcDark: {
    name: "ITS WOTC (Dark)",
    colors: {
      // Uses the ITS wotc-beyond dark values
      // Dark base from ITS default dark + WOTC overrides
      colorBgPrimary: "#1e1e1e",
      colorBgSecondary: "#282828",
      colorBgTertiary: "#323232",
      colorBgHover: "#2c2c2c",
      colorBgDarker: "#181818",
      colorBgGroup: "#242424",
      colorBgProficient: "#2a2a2a",

      // --headers: #c14343, --text: inherits ITS dark default
      colorTextPrimary: "#d3b4a9",
      colorTextSecondary: "#bf5e5e",
      colorTextSublabel: "#a08070",
      colorTextBright: "#ffe0d0",
      colorTextMuted: "#c09880",
      colorTextGroup: "#c14343",

      // --hr: #772d2d, --accent: #863737
      colorBorderPrimary: "#772d2d",
      colorBorderActive: "#863737",
      colorBorderFocus: "rgba(134, 55, 55, 0.5)",

      // --code-text: #fa4545, --accent: #863737
      colorAccentTeal: "#45b480",
      colorAccentRed: "#c14343",
      colorAccentPurple: "#863737",
    },
  },

  itsWotcLight: {
    name: "ITS WOTC (Light)",
    colors: {
      // --note: #fff9f0, --code-bg: #f3e6d2, --aside-bg: #faf2e9
      colorBgPrimary: "#fff9f0",
      colorBgSecondary: "#faf2e9",
      colorBgTertiary: "#f3e6d2",
      colorBgHover: "#f6e3cd",
      colorBgDarker: "#fbe2c5",
      colorBgGroup: "#faf2e9",
      colorBgProficient: "#fff6e4",

      // --text: #412f2f, --headers: #c14343
      colorTextPrimary: "#412f2f",
      colorTextSecondary: "#681010",
      colorTextSublabel: "#5c1c16",
      colorTextBright: "#2e1010",
      colorTextMuted: "#e2b7a3",
      colorTextGroup: "#c14343",

      // --outline: #fbb4577e, --accent: #c75959
      colorBorderPrimary: "#fbb457",
      colorBorderActive: "#c75959",
      colorBorderFocus: "rgba(199, 89, 89, 0.4)",

      // --accent: #c75959, --accent2-lite: #df6262
      colorAccentTeal: "#00c25e",
      colorAccentRed: "#c75959",
      colorAccentPurple: "#a35158",
    },
  },

  itsPathfinderDark: {
    name: "ITS Pathfinder (Dark)",
    colors: {
      // Pathfinder dark inherits ITS default dark note bg
      colorBgPrimary: "#1e1e1e",
      colorBgSecondary: "#282828",
      colorBgTertiary: "#323232",
      colorBgHover: "#2c2c2c",
      colorBgDarker: "#181818",
      colorBgGroup: "#242424",
      colorBgProficient: "#2a2a2a",

      // --headers: #ddaf78 (gold), --h3-color: #a22b30 (burgundy)
      colorTextPrimary: "#d0c8c0",
      colorTextSecondary: "#ddaf78",
      colorTextSublabel: "#bf5e5e",
      colorTextBright: "#f0e8d8",
      colorTextMuted: "#a09088",
      colorTextGroup: "#ddaf78",

      // --hr: #8b262d, --dark-accent: #652121
      colorBorderPrimary: "#652121",
      colorBorderActive: "#863737",
      colorBorderFocus: "rgba(134, 55, 55, 0.5)",

      // --lite-accent: #c94d4d, --h2-color: #2f4f87
      colorAccentTeal: "#4dbb84",
      colorAccentRed: "#a22b30",
      colorAccentPurple: "#2f4f87",
    },
  },

  itsPathfinderLight: {
    name: "ITS Pathfinder (Light)",
    colors: {
      // --note: #ECE9E4, --embed-bg: #E0DACB
      colorBgPrimary: "#ECE9E4",
      colorBgSecondary: "#E0DACB",
      colorBgTertiary: "#d2c4be",
      colorBgHover: "#e2ded8",
      colorBgDarker: "#d2c4be",
      colorBgGroup: "#E0DACB",
      colorBgProficient: "#ECE9E4",

      // --text: #393636, --headers: #ca9759, --soft-text: #5C1C16
      colorTextPrimary: "#393636",
      colorTextSecondary: "#5C1C16",
      colorTextSublabel: "#676767",
      colorTextBright: "#1a1010",
      colorTextMuted: "#cdab9a",
      colorTextGroup: "#ca9759",

      // --lines: #b6a697, --outline: rgba(124, 49, 3, 0.4)
      colorBorderPrimary: "#b6a697",
      colorBorderActive: "#800008",
      colorBorderFocus: "rgba(128, 0, 8, 0.4)",

      // --accent: #800008, --h2-color: #002564
      colorAccentTeal: "#188655",
      colorAccentRed: "#800008",
      colorAccentPurple: "#002564",
    },
  },

  itsPathfinderRemasterDark: {
    name: "ITS Pathfinder Remaster (Dark)",
    colors: {
      // Green variant of Pathfinder dark
      colorBgPrimary: "#1e1e1e",
      colorBgSecondary: "#282828",
      colorBgTertiary: "#323232",
      colorBgHover: "#2c2c2c",
      colorBgDarker: "#181818",
      colorBgGroup: "#253f32",
      colorBgProficient: "#2a2a2a",

      // --headers: #2f8b62, --accent: #3b7b5b
      colorTextPrimary: "#d0c8c0",
      colorTextSecondary: "#4dbb84",
      colorTextSublabel: "#887440",
      colorTextBright: "#f0e8d8",
      colorTextMuted: "#a09088",
      colorTextGroup: "#2f8b62",

      // --hr: #2d4d3d, --dark-accent: #253f32
      colorBorderPrimary: "#2d4d3d",
      colorBorderActive: "#3b7b5b",
      colorBorderFocus: "rgba(59, 123, 91, 0.5)",

      // --lite-accent: #4dbb84, --h3-color: #a22b30
      colorAccentTeal: "#4dbb84",
      colorAccentRed: "#a22b30",
      colorAccentPurple: "#c0a14a",
    },
  },

  itsPathfinderRemasterLight: {
    name: "ITS Pathfinder Remaster (Light)",
    colors: {
      // Same base as Pathfinder light but with green accents
      colorBgPrimary: "#ECE9E4",
      colorBgSecondary: "#E0DACB",
      colorBgTertiary: "#d2c4be",
      colorBgHover: "#e2ded8",
      colorBgDarker: "#d2c4be",
      colorBgGroup: "#E0DACB",
      colorBgProficient: "#ECE9E4",

      // --headers: #002a17, --text: #393636, --soft-text: #025d4e
      colorTextPrimary: "#393636",
      colorTextSecondary: "#025d4e",
      colorTextSublabel: "#676767",
      colorTextBright: "#002a17",
      colorTextMuted: "#cab47c",
      colorTextGroup: "#002a17",

      // Remaster uses green borders
      colorBorderPrimary: "#b6a697",
      colorBorderActive: "#025D4E",
      colorBorderFocus: "rgba(2, 93, 78, 0.4)",

      // --accent: #025D4E, --lite-accent: #188655
      colorAccentTeal: "#188655",
      colorAccentRed: "#800008",
      colorAccentPurple: "#4e1b0e",
    },
  },

  // --- Dark Themes ---

  moonstone: {
    name: "Moonstone (Dark)",
    colors: {
      colorBgPrimary: "#1a1d2e",
      colorBgSecondary: "#232840",
      colorBgTertiary: "#2c3252",
      colorBgHover: "#282e48",
      colorBgDarker: "#1e2238",
      colorBgGroup: "#222844",
      colorBgProficient: "#242a42",

      colorTextPrimary: "#c8cce0",
      colorTextSecondary: "#8892c0",
      colorTextSublabel: "#7e8ab8",
      colorTextBright: "#e8ecff",
      colorTextMuted: "#9ca4c8",
      colorTextGroup: "#a0b4ff",

      colorBorderPrimary: "#2e3556",
      colorBorderActive: "#5c72c4",
      colorBorderFocus: "rgba(92, 114, 196, 0.5)",

      colorAccentTeal: "#6ec6ff",
      colorAccentRed: "#f06880",
      colorAccentPurple: "#a78bfa",
    },
  },

  forest: {
    name: "Forest (Dark)",
    colors: {
      colorBgPrimary: "#1a2420",
      colorBgSecondary: "#223028",
      colorBgTertiary: "#2a3a30",
      colorBgHover: "#263428",
      colorBgDarker: "#1e2a24",
      colorBgGroup: "#203028",
      colorBgProficient: "#243028",

      colorTextPrimary: "#c8dcd0",
      colorTextSecondary: "#82a892",
      colorTextSublabel: "#78a088",
      colorTextBright: "#e0f0e8",
      colorTextMuted: "#98b8a4",
      colorTextGroup: "#6ec490",

      colorBorderPrimary: "#2e4438",
      colorBorderActive: "#4a8a66",
      colorBorderFocus: "rgba(74, 138, 102, 0.5)",

      colorAccentTeal: "#4cd8a0",
      colorAccentRed: "#e07060",
      colorAccentPurple: "#a08cd0",
    },
  },

  ocean: {
    name: "Ocean (Dark)",
    colors: {
      colorBgPrimary: "#0f1b2d",
      colorBgSecondary: "#162640",
      colorBgTertiary: "#1e3050",
      colorBgHover: "#1a2c48",
      colorBgDarker: "#132238",
      colorBgGroup: "#162840",
      colorBgProficient: "#182a42",

      colorTextPrimary: "#c0d4e8",
      colorTextSecondary: "#7098c0",
      colorTextSublabel: "#6890b8",
      colorTextBright: "#e0eeff",
      colorTextMuted: "#88a8cc",
      colorTextGroup: "#60a8e0",

      colorBorderPrimary: "#1e3654",
      colorBorderActive: "#3878b4",
      colorBorderFocus: "rgba(56, 120, 180, 0.5)",

      colorAccentTeal: "#40c8e0",
      colorAccentRed: "#e86060",
      colorAccentPurple: "#9880d8",
    },
  },

  crimson: {
    name: "Crimson (Dark)",
    colors: {
      colorBgPrimary: "#201a1e",
      colorBgSecondary: "#2e2228",
      colorBgTertiary: "#3a2a32",
      colorBgHover: "#34262c",
      colorBgDarker: "#281e24",
      colorBgGroup: "#2c2028",
      colorBgProficient: "#2e2228",

      colorTextPrimary: "#e0ccd4",
      colorTextSecondary: "#c08898",
      colorTextSublabel: "#b88090",
      colorTextBright: "#ffe0e8",
      colorTextMuted: "#c898a8",
      colorTextGroup: "#e07088",

      colorBorderPrimary: "#442e38",
      colorBorderActive: "#a04860",
      colorBorderFocus: "rgba(160, 72, 96, 0.5)",

      colorAccentTeal: "#50c8b0",
      colorAccentRed: "#e85060",
      colorAccentPurple: "#c080c0",
    },
  },

  amber: {
    name: "Amber (Dark)",
    colors: {
      colorBgPrimary: "#221c14",
      colorBgSecondary: "#2e261a",
      colorBgTertiary: "#3a3020",
      colorBgHover: "#342a1e",
      colorBgDarker: "#282018",
      colorBgGroup: "#2c241a",
      colorBgProficient: "#2e261c",

      colorTextPrimary: "#e0d4c0",
      colorTextSecondary: "#c0a878",
      colorTextSublabel: "#b89e70",
      colorTextBright: "#fff0d0",
      colorTextMuted: "#c8b088",
      colorTextGroup: "#e0a840",

      colorBorderPrimary: "#443828",
      colorBorderActive: "#a08040",
      colorBorderFocus: "rgba(160, 128, 64, 0.5)",

      colorAccentTeal: "#50c8a0",
      colorAccentRed: "#d86050",
      colorAccentPurple: "#b898d0",
    },
  },

  // --- Light Themes ---

  parchment: {
    name: "Parchment (Light)",
    colors: {
      colorBgPrimary: "#f5f0e8",
      colorBgSecondary: "#ebe4d8",
      colorBgTertiary: "#e0d8c8",
      colorBgHover: "#e8e0d0",
      colorBgDarker: "#d8d0c0",
      colorBgGroup: "#ede6da",
      colorBgProficient: "#f0eade",

      colorTextPrimary: "#3a3428",
      colorTextSecondary: "#6e6450",
      colorTextSublabel: "#7a7060",
      colorTextBright: "#1a1408",
      colorTextMuted: "#887860",
      colorTextGroup: "#8a5a2a",

      colorBorderPrimary: "#d0c8b4",
      colorBorderActive: "#8a6830",
      colorBorderFocus: "rgba(138, 104, 48, 0.4)",

      colorAccentTeal: "#2a8a60",
      colorAccentRed: "#b04030",
      colorAccentPurple: "#704098",
    },
  },

  stone: {
    name: "Stone (Light)",
    colors: {
      colorBgPrimary: "#f0f0f0",
      colorBgSecondary: "#e4e4e6",
      colorBgTertiary: "#d8d8dc",
      colorBgHover: "#e0e0e4",
      colorBgDarker: "#d0d0d4",
      colorBgGroup: "#e6e6ea",
      colorBgProficient: "#eaeaee",

      colorTextPrimary: "#2a2a32",
      colorTextSecondary: "#5c5c68",
      colorTextSublabel: "#68687a",
      colorTextBright: "#0a0a12",
      colorTextMuted: "#787888",
      colorTextGroup: "#484860",

      colorBorderPrimary: "#c8c8d0",
      colorBorderActive: "#6060a0",
      colorBorderFocus: "rgba(96, 96, 160, 0.4)",

      colorAccentTeal: "#2898a0",
      colorAccentRed: "#c04848",
      colorAccentPurple: "#7050b0",
    },
  },

  oceanLight: {
    name: "Ocean (Light)",
    colors: {
      colorBgPrimary: "#eaf2f8",
      colorBgSecondary: "#dce8f2",
      colorBgTertiary: "#ccdee8",
      colorBgHover: "#d4e4f0",
      colorBgDarker: "#c4d8e4",
      colorBgGroup: "#dee8f4",
      colorBgProficient: "#e4eef6",

      colorTextPrimary: "#1a2840",
      colorTextSecondary: "#3c5878",
      colorTextSublabel: "#486888",
      colorTextBright: "#0a1830",
      colorTextMuted: "#5878a0",
      colorTextGroup: "#2060a0",

      colorBorderPrimary: "#b8d0e0",
      colorBorderActive: "#3070b0",
      colorBorderFocus: "rgba(48, 112, 176, 0.4)",

      colorAccentTeal: "#1890a0",
      colorAccentRed: "#c84848",
      colorAccentPurple: "#6848b0",
    },
  },

  forestLight: {
    name: "Forest (Light)",
    colors: {
      colorBgPrimary: "#ecf4ec",
      colorBgSecondary: "#deeade",
      colorBgTertiary: "#d0e0d0",
      colorBgHover: "#d8e6d8",
      colorBgDarker: "#c8dac8",
      colorBgGroup: "#e0ece0",
      colorBgProficient: "#e6f0e6",

      colorTextPrimary: "#1c2c20",
      colorTextSecondary: "#3c5c42",
      colorTextSublabel: "#487050",
      colorTextBright: "#0c1c10",
      colorTextMuted: "#587860",
      colorTextGroup: "#287040",

      colorBorderPrimary: "#b4d0b8",
      colorBorderActive: "#388848",
      colorBorderFocus: "rgba(56, 136, 72, 0.4)",

      colorAccentTeal: "#1c8870",
      colorAccentRed: "#c04840",
      colorAccentPurple: "#7850a8",
    },
  },

  rose: {
    name: "Rose (Light)",
    colors: {
      colorBgPrimary: "#f8eef2",
      colorBgSecondary: "#f0e2e8",
      colorBgTertiary: "#e6d4dc",
      colorBgHover: "#ecdae2",
      colorBgDarker: "#dec8d2",
      colorBgGroup: "#f2e4ec",
      colorBgProficient: "#f4e8ee",

      colorTextPrimary: "#381828",
      colorTextSecondary: "#704060",
      colorTextSublabel: "#7c4c6c",
      colorTextBright: "#200c18",
      colorTextMuted: "#906878",
      colorTextGroup: "#a03868",

      colorBorderPrimary: "#d8bcc8",
      colorBorderActive: "#a04870",
      colorBorderFocus: "rgba(160, 72, 112, 0.4)",

      colorAccentTeal: "#2890a0",
      colorAccentRed: "#c84050",
      colorAccentPurple: "#9050a8",
    },
  },
};
