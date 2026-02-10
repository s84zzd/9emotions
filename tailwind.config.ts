import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C6FF6",
        secondary: "#AFA7FF",
        background: "#F8F7FC",
        "text-main": "#3A3550",
        "tag-bg": "#EFEAFF",
      },
      borderRadius: {
        card: "16px",
        tag: "12px",
        chart: "20px",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
