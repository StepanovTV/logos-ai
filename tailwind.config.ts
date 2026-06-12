import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: "#131316",
        surface: "#1f1f22",
        primary: "#00f0ff",
        secondary: "#e9b3ff",
        "text-main": "#e4e1e6",
        "text-muted": "#849495",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "4px",
        lg: "8px",
      },
      backdropBlur: {
        glass: "20px",
        "glass-heavy": "40px",
      },
    },
  },
};

export default config;
