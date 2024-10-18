/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     colors:{
     'custom-blue': '#F0F9FF',
			'custom-purple':'#EAE3FA',
			'custom-pink':'#FFF0F7',
			'custom-darkPink':'#EAE3FA',
			'custom-yellow':'#FFFAE1',
			'custom-red':'#FCE5F0',
			'custom-selectedPurple':'#B21FDC',
     }
    },
  },
  plugins: [],
}
