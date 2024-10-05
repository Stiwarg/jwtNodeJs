/* Content: Aqui defines las rutas donde Tailwind buscara clases CSS, en este caso se especifica las rutas de los archvios .ejs*/ 

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './views/**/*.ejs'
  ],
  theme: {
    extend: {
      fontFamily: {
        figtree: ['Figtree', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

