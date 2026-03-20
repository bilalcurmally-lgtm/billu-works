/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:               '#080808',
        surface:          '#111111',
        border:           '#222222',
        'text-primary':   '#F5F5F0',
        'text-secondary': '#888888',
        accent:           '#F5F0E8',
        'accent-dark':    '#1A1A1A',
        // Grey scale for consistent contrast (WCAG AA)
        'muted':          '#777777',  // labels, metadata, small text on large surfaces
        'secondary':      '#999999',  // body secondary text (5.28:1 on #080808)
        'dim':            '#555555',  // decorative, borders, non-essential
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        drama:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
