const plugin = require('tailwindcss/plugin');
const lineClamp = require('@tailwindcss/line-clamp');
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,

    // TODO: Re-enable once Bootstrap components are purged
    // Temporarily disabled because Tailwind 3.2.0 adds a new `collapse` utility
    // that conflicts with Bootstrap's Collapse component used in our sidebar.
    visibility: false,
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('pointer-none', '@media (pointer: none)');
      addVariant('pointer-fine', '@media (pointer: fine)');
      addVariant('pointer-coarse', '@media (pointer: coarse)');
      addVariant('no-hover', '@media (hover: none)');
      addVariant('hoverable', '@media (hover: hover)');
    }),
    plugin(({ addVariant }) => {
      addVariant('hover?', '@media (hover: hover) { &:hover }');
      addVariant(
        'group-hover?',
        '@media (hover: hover) { :merge(.group):hover & }',
      );
    }),
    lineClamp,
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'bg-fade-to-l': (value) => ({
            background: `linear-gradient(90deg, transparent 0%, ${value} 20%)`,
          }),
        },
        { values: flattenColorPalette(theme('colors')), type: 'color' },
      );
    }),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        { wh: (value) => ({ width: value, height: value }) },
        { values: theme('spacing'), type: 'number' },
      );
    }),
  ],
  important: '#root',
};
