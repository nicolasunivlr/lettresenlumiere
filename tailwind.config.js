/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./assets/**/*.{js,jsx,html}",
    "./templates/**/*.html.twig",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.font-cursiv': {
          'font-family': 'Cursivfont, sans-serif',
          'letter-spacing': '0px',
          'line-height': '1.5',
        },

        '.font-cursivupp': {
          'font-family': 'Cursivfontupp, sans-serif',
          'letter-spacing': '0px',
          'line-height': '1.5',
        },
        
        '.font-script': {
          'font-family': 'Verdana, sans-serif',
          'letter-spacing': '1px',
          'line-height': '1.5',
          
        },
        '.font-regular': {
          'font-family': 'Trebuchet, sans-serif',
          'letter-spacing': '1px',
        },
      });
    },
  ],
};
