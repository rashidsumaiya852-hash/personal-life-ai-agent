/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#1d4ed8",
          600: "#1e40af",
          700: "#172554",
        },
        surface: {
          light: "#ffffff",
          dark: "#171a21",
        },
        page: {
          light: "#f9fafb",
          dark: "#0f1115",
        },
        edge: {
          light: "#e5e7eb",
          dark: "#262a33",
        },
        status: {
          success: "#15803d",
          warning: "#b45309",
          danger: "#b91c1c",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        bangla: ["'Hind Siliguri'", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        element: "6px",
      }
    },
  },
  plugins: [],
};
