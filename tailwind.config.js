module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    screens: {
      'sm': '10px',
      'xs': '410px',
      // => @media (min-width: 640px) { ... }
      // => @media (min-width: 640px) { ... }

      // 'md': '768px',
      // => @media (min-width: 768px) { ... }

      // 'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1000px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}