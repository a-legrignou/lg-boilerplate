import { Config } from 'tailwindcss';

export default {
  content: [
    './apps/web/src/**/*.{js,ts,jsx,tsx}',
    './packages/ui/src/**/*.{js,ts,jsx,tsx}',
    './modules/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
