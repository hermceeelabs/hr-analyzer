/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#bae0ff',
          300: '#7cc2ff',
          400: '#369eff',
          500: '#0c7ff2',
          600: '#0062d6',
          700: '#004eb3',
          800: '#054293',
          900: '#0b3876',
          950: '#0a234b',
        },
        navy: {
          50: '#f4f6f8',
          100: '#e8ecf0',
          200: '#cfd8e3',
          300: '#a7b8cc',
          400: '#7792b0',
          500: '#537295',
          600: '#3e5879',
          700: '#324763',
          800: '#1e293b',
          900: '#0f172a',
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
