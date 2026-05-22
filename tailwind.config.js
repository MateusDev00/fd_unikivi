/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {

      /* =========================================================
         🎨 PALETA ORIGINAL PRESERVADA
         ========================================================= */

      colors: {

        primary: '#8c0034',

        dark: '#0a2b1d',

        'dark-light': '#195f41',

        'primary-light': '#e6f4e7',

        heading: '#8c0034',

        body: '#6b7280',

        /* Novos complementos */
        surface: '#ffffff',

        muted: '#f8fafc',

        soft: '#faf7f8',

        border: 'rgba(140,0,52,0.08)',

        glass: 'rgba(255,255,255,0.10)',
      },

      /* =========================================================
         🔤 TIPOGRAFIA
         ========================================================= */

      fontFamily: {

        serif: [
          'Poppins',
          'Georgia',
          'Times New Roman',
          'serif'
        ],

        sans: [
          'Inter',
          'system-ui',
          'sans-serif'
        ],
      },

      /* =========================================================
         🌫️ SHADOWS
         Soft Claymorphism
         ========================================================= */

      boxShadow: {

        soft: '0 8px 30px rgba(0,0,0,0.04)',

        card: '0 15px 45px rgba(140,0,52,0.10)',

        glow: '0 0 35px rgba(140,0,52,0.15)',

        glass: `
          0 8px 32px rgba(31,38,135,0.08)
        `,
      },

      /* =========================================================
         ⭕ BORDER RADIUS
         ========================================================= */

      borderRadius: {

        '4xl': '2rem',
      },

      /* =========================================================
         🌈 BACKGROUNDS
         ========================================================= */

      backgroundImage: {

        'gradient-primary': `
          linear-gradient(
            135deg,
            #8c0034 0%,
            #a80042 45%,
            #c2185b 100%
          )
        `,

        'gradient-dark': `
          linear-gradient(
            135deg,
            #0a2b1d 0%,
            #195f41 100%
          )
        `,

        'gradient-soft': `
          linear-gradient(
            180deg,
            rgba(255,255,255,0.95),
            rgba(255,255,255,0.82)
          )
        `,
      },

      /* =========================================================
         ✨ ANIMAÇÕES
         ========================================================= */

      animation: {

        'fade-up': 'fadeUp .8s ease-out',

        float: 'float 6s ease-in-out infinite',

        shimmer: 'shimmer 2.5s linear infinite',

        pulseSoft: 'pulseSoft 4s ease-in-out infinite',
      },

      keyframes: {

        fadeUp: {

          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },

          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        float: {

          '0%,100%': {
            transform: 'translateY(0px)',
          },

          '50%': {
            transform: 'translateY(-10px)',
          },
        },

        shimmer: {

          '0%': {
            backgroundPosition: '200% 0',
          },

          '100%': {
            backgroundPosition: '-200% 0',
          },
        },

        pulseSoft: {

          '0%,100%': {
            transform: 'scale(1)',
            opacity: '.88',
          },

          '50%': {
            transform: 'scale(1.03)',
            opacity: '1',
          },
        },
      },

      /* =========================================================
         🌫️ BLUR
         ========================================================= */

      backdropBlur: {

        xs: '2px',
      },
    },
  },

  plugins: [],
};