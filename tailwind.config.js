/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          800: '#1a1a2e',
          700: '#21213d',
          600: '#2c2c4c',
          500: '#373759',
          400: '#4f4f73',
          300: '#696990',
          200: '#8d8daa',
          100: '#b8b8cc',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/index.html',
    ],
    options: {
      safelist: [
        // Ensure essential classes aren't purged
        /^bg-/,
        /^text-/,
        /^border-/,
        /^hover:/,
        /^dark:/,
        /^h-/,
        /^w-/,
        /^p-/,
        /^m-/,
        'animate-spin',
        'anime-gradient-bg',
        'rounded-full',
        'rounded-lg',
        'object-cover',
        'transition-opacity',
        'transition-transform',
        'duration-300'
      ],
    },
  },
} 