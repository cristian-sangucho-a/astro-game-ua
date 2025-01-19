/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./*.html", // Aplica a todos los archivos HTML en la raíz del proyecto
        "./src/**/*.{js,jsx,ts,tsx,html}", // Aplica a todos los archivos JavaScript, TypeScript y HTML en el directorio src
    ],
    theme: {
        extend: {
            colors: {
                header: "#8B97C7",
                footer: "#242C4C",
            },
            backgroundImage: {
                "space-background": "url('/src/assets/espacio-fondo.jpg')", // Define tu imagen de fondo personalizada
            },
            fontFamily: {
                "ibm-plex-mono": ['"IBM Plex Mono"', "monospace"], // Define la fuente personalizada
            },
        },
    },
    plugins: [],
};

