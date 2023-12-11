module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {}
  },
  plugins: [],
  corePlugins: {
    // TODO: This should disable Tailwind's preflight styles, but it doesn't.
    // TODO: See https://tailwindcss.com/docs/preflight
    preflight: false
  }
};
