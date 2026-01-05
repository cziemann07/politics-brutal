import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        headline: ["Inter", "var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        // Light mode - Profissional e sério
        "radar-bg": "#FAFAFA",
        "radar-surface": "#FFFFFF",
        "radar-primary": "#1A1A2E",
        "radar-accent": "#E63946",
        "radar-secondary": "#457B9D",
        "radar-text": "#1A1A2E",
        "radar-muted": "#6B7280",
        "radar-border": "#E5E7EB",
        // Dark mode - Moderno e elegante
        "radar-dark-bg": "#0F0F0F",
        "radar-dark-surface": "#1A1A1A",
        "radar-dark-primary": "#E5E5E5",
        "radar-dark-accent": "#E63946",
        "radar-dark-secondary": "#64B5F6",
        "radar-dark-text": "#E5E5E5",
        "radar-dark-muted": "#71767B",
        "radar-dark-border": "#2D2D2D",
        // Cores semânticas
        "radar-success": "#10B981",
        "radar-warning": "#F59E0B",
        "radar-error": "#EF4444",
        "radar-info": "#3B82F6",
      },
      spacing: {
        "xs": "0.5rem",    // 8px
        "sm": "1rem",      // 16px
        "md": "1.5rem",    // 24px
        "lg": "2.5rem",    // 40px
        "xl": "4rem",      // 64px
        "2xl": "6rem",     // 96px
      },
      boxShadow: {
        "soft": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "medium": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "large": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "card": "0 1px 3px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        "sm": "4px",
        "md": "8px",
        "lg": "12px",
        "xl": "16px",
      },
      fontSize: {
        "headline-xl": ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-lg": ["2rem", { lineHeight: "1.25", fontWeight: "700" }],
        "headline-md": ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-sm": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [],
};
export default config;
