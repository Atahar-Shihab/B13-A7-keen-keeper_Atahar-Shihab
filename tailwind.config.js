/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: withOpacity('--kk-slate-50'),
          100: withOpacity('--kk-slate-100'),
          200: withOpacity('--kk-slate-200'),
          300: withOpacity('--kk-slate-300'),
          400: withOpacity('--kk-slate-400'),
          500: withOpacity('--kk-slate-500'),
          600: withOpacity('--kk-slate-600'),
          700: withOpacity('--kk-slate-700'),
          750: withOpacity('--kk-slate-750'),
          800: withOpacity('--kk-slate-800'),
          850: withOpacity('--kk-slate-850'),
          900: withOpacity('--kk-slate-900'),
          950: withOpacity('--kk-slate-950'),
        },
        indigo: {
          50: withOpacity('--kk-indigo-50'),
          100: withOpacity('--kk-indigo-100'),
          200: withOpacity('--kk-indigo-200'),
          300: withOpacity('--kk-indigo-300'),
          400: withOpacity('--kk-indigo-400'),
          500: withOpacity('--kk-indigo-500'),
          600: withOpacity('--kk-indigo-600'),
          700: withOpacity('--kk-indigo-700'),
          800: withOpacity('--kk-indigo-800'),
          900: withOpacity('--kk-indigo-900'),
          950: withOpacity('--kk-indigo-950'),
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
  },
};
