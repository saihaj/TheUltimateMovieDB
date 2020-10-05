/* eslint-disable global-require */
module.exports = {
  purge: [
    './**/*.tsx',
    './**/*.ts',
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require( '@tailwindcss/custom-forms' ),
  ],
}
