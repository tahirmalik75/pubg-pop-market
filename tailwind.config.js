/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pubg-blue': '#3B82F6',
        'pubg-accent': '#2563EB',
        'pubg-yellow': '#F8E71C',
        'pubg-orange': '#F5A623',
        'pubg-dark': '#010101',
        'pubg-gray': '#121212',
        'pubg-light': '#1E293B',
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}

export default config
