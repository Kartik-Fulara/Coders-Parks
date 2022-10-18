/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  important: true,
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './models/**/*.{js,ts,jsx,tsx}',
    './Icons/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1E90FF',
        'secondary': '#FF6347',
        'danger': '#DC143C',
        'primary-blue': '#7289da',
        'black1': '#424549',
        'black2': '#36393e',
        'black3': '#282b30',
        'black4': '#1e2124'
      },
  },
  plugins: [],
}
}
