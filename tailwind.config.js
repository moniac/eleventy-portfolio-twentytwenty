const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    content: ["./src/**/*.{js,mdx}", "./_site/**/*.html"],
    whitelist: ["dark-mode"],
  },
  theme: {
    // Replaces default settings or add new settings
    container: {
      center: true,
    },
    darkSelector: ".dark-mode",
    // Extends default settings
    extend: {
      fontFamily: {
        // Use Tailwind default serif fonts with font-display
        display: [...defaultTheme.fontFamily.serif],
      },
      colors: {
        bodybg: "var(--color-bodybg)",
        muted: "var(--color-muted)",
        bodytext: "var(--color-bodytext)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        links: "var(--color-links)",
        focus: "var(--color-focus)",
      },
    },
  },
  variants: {
    backgroundColor: ["hover", "focus", "dark", "dark-hover", "dark-focus"],
    borderColor: ["hover", "focus", "dark", "dark-hover", "dark-focus"],
    textColor: ["hover", "focus", "dark", "dark-hover", "dark-focus"],
  },
  plugins: [
    require("tailwindcss-dark-mode")(), // https://github.com/ChanceArthur/tailwindcss-dark-mode
  ],
  experimental: {
    uniformColorPalette: true,
  },
  future: {
    removeDeprecatedGapUtilities: true,
  },
};
