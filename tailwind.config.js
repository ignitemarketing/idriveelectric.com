// Build: npx --yes tailwindcss@3.4.17 -i src/input.css -o style.css --minify
// Commit the generated style.css; the Pages deploy has no build step.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        ink:    { 950: '#06080F', 900: '#0A0E1A', 800: '#10172A', 700: '#1A2440', 600: '#2A3658', 500: '#475878' },
        cyan:   { 300: '#67F5FF', 400: '#33EAFF', 500: '#00E5FF', 600: '#00BCD4' },
        volt:   { 400: '#4ADE80', 500: '#22C55E', 600: '#16A34A' },
        bone:   { 50: '#F5F7FA', 100: '#E7ECF3', 200: '#C9D2DE' }
      }
    }
  }
}
