/**
 * Theme color tokens for programmatic use (matching Tailwind @theme values in globals.css).
 */
export const colors = {
  primary: "#CA8F36",
  primaryLight: "#EABE7D",
  primaryDark: "#906421",
  secondary: "#009FB7",

  background: {
    light: "#F2F6FF",
    dark: "#2B2830",
  },

  text: {
    light: {
      primary: "#000000",
      secondary: "rgba(0,0,0,0.7)",
    },
    dark: {
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.7)",
    },
  },

  card: {
    light: {
      background: "rgba(255, 255, 255, 0.6)",
      backgroundFull: "rgba(255, 255, 255, 1)",
      boxShadow:
        "0px 50px 100px rgba(34, 79, 169, 0.3), inset 0 0 0 0.5px rgba(255, 255, 255, 0.6)",
    },
    dark: {
      background: "rgba(25, 24, 63, 0.98)",
      backgroundFull: "rgba(15, 14, 71, 1)",
      boxShadow:
        "0px 30px 60px rgba(0, 0, 0, 0.25), inset 0 0 0 0.5px rgba(255, 255, 255, 0.2)",
    },
  },

  cardHover: {
    light: {
      background: "rgba(68, 66, 178, 0.1)",
      boxShadow: "inset 0px 0px 0px 0.5px rgba(68, 66, 178, 0.2)",
    },
    dark: {
      background: "rgba(255, 255, 255, 0.1)",
      boxShadow: "inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.2)",
    },
  },
} as const;
