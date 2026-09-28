/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: '#8c0034',        // vinho principal
        'primary-light': '#fce4ec', // rosa/vinho claro
        dark: '#1a1a1a',            // tom neutro escuro (substitui azul)
        'dark-light': '#2d2d2d',    // neutro escuro mais claro
        heading: '#8c0034',         // títulos em vinho
        body: '#4b5563',            // texto secundário
        surface: '#ffffff',
        muted: '#f9fafb',
        border: 'rgba(140,0,52,0.08)',
      },
      fontFamily: {
        serif: ['Poppins', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.04)',
        card: '0 15px 45px rgba(140,0,52,0.10)',
        glow: '0 0 35px rgba(140,0,52,0.15)',
      },
      backgroundImage: {
        'gradient-primary': `
          linear-gradient(135deg, #8c0034 0%, #a80042 45%, #c2185b 100%)
        `,
        'gradient-dark': `
          linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)
        `,
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};