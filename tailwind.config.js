/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./*.html", // Aplica a todos los archivos HTML en la raíz del proyecto
        "./src/**/*.{js,jsx,ts,tsx,html}", // Aplica a todos los archivos JavaScript, TypeScript y HTML en el directorio src
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

