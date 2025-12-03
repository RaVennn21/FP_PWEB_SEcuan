// postcss.config.js
import tailwindcss from '@tailwindcss/postcss';

export default {
  plugins: [
    tailwindcss(),   // Tailwind v4 PostCSS plugin
    // you can add other plugins here, e.g. require('autoprefixer')()
  ],
};
