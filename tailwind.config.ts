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
        sans: ['var(--font-geist-sans)', 'sans-serif'],
      },
      colors: {
        'brutal-bg': '#F4F4F0',
        'brutal-black': '#000000',
        'brutal-yellow': '#FFE600',
        'brutal-blue': '#4A90E2',
        'brutal-red': '#FF4444',
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px #000',
        'hard-hover': '6px 6px 0px 0px #000',
        'hard-active': '0px 0px 0px 0px #000',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
};
export default config;