export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: '#0b0b0c', paper: '#f4f4f2', signal: '#ff5b1f', cobalt: '#1a3cff' },
    fontFamily: { display: ['Unbounded', 'system-ui', 'sans-serif'], mono: ['"Space Mono"', 'ui-monospace', 'monospace'], sans: ['Inter', 'system-ui', 'sans-serif'] }
  } },
  plugins: []
}
