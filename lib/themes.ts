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
    name: "WOTC/Beyond",
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
};
