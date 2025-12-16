import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Ajustei aqui para olhar tanto na raiz quanto na src, por garantia
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
      },
      colors: {
        "brutal-bg": "#F4F4F0",
        "brutal-black": "#000000",
        "brutal-yellow": "#FFE600",
        "brutal-blue": "#4A90E2",
        "brutal-red": "#FF4444",
      },
      spacing: {
        "brutal-xs": "0.5rem", // 8px - Interno de cards
        "brutal-sm": "1rem", // 16px - Elementos relacionados
        "brutal-md": "1.5rem", // 24px - Entre cards
        "brutal-lg": "2.5rem", // 40px - Entre seções
        "brutal-xl": "4rem", // 64px - Separação dramática
        "brutal-2xl": "6rem", // 96px - Apenas após Hero
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #000",
        "hard-hover": "6px 6px 0px 0px #000",
        "hard-active": "0px 0px 0px 0px #000",
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};
export default config;
