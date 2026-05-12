/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      
      colors: {
        brand: {
          accent: "#0d9488",
          "accent-dark": "#0f766e",
          "accent-muted": "#ccfbf1",
          ink: "#0f172a",
          muted: "#64748b",
          surface: "#f8fafc",
          border: "#e2e8f0",
        },
        light: {
          text: '#00BE76',
          secondaryText: '#757575',
          background: '#FFFFFF',
          surface: '#F5F5F5',
          border: '#E0E0E0',
          primary: '#66BB6A',
          secondary: '#42A5F5',
          success: '#4CAF50',
          warning: '#FFB300',
          error: '#EF5350',
        },
        dark: {
          text: '#FFFFFF',
          secondaryText: '#B0B0B0',
          background: '#121212',
          surface: '#212121',
          border: '#323232',
          primary: '#81C784',
          secondary: '#64B5F6',
          success: '#A5D6A7',
          warning: '#FFD54F',
          error: '#EF9A9A',
        },

      }
    },
  },
  plugins: [],
}
