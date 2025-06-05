/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rubik': ['var(--font-rubik)', 'sans-serif'],
        'nunito': ['var(--font-nunito)', 'sans-serif'],
        'markazi': ['var(--font-markazi-text)', 'serif'],
        'noto-kufi-arabic': ['var(--font-noto-kufi-arabic)', 'sans-serif'],
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out forwards",
        "slide-in-from-top": "slide-in-from-top 0.5s ease-in-out forwards",
        "slide-in-from-bottom": "slide-in-from-bottom 0.5s ease-in-out forwards",
        "slide-in-from-left": "slide-in-from-left 0.5s ease-in-out forwards",
        "slide-in-from-right": "slide-in-from-right 0.5s ease-in-out forwards",
        "zoom-in": "zoom-in 0.5s ease-in-out forwards",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "zoom-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  plugins: [],
};
