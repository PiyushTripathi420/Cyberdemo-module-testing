/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {
    colors: { cyber: { black: '#05090d', panel: '#07131b', cyan: '#20f4ff', teal: '#00c7d5', red: '#ff3158' } },
    fontFamily: { orbitron: ['Orbitron', 'sans-serif'], mono: ['Share Tech Mono', 'monospace'], rajdhani: ['Rajdhani', 'sans-serif'] }
  }},
  plugins: []
}