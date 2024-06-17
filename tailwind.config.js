/** @type {import('tailwindcss').Config} */
export default {
  content: ['resources/**/*.edge'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  // eslint-disable-next-line unicorn/prefer-module
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
