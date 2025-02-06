/** @type {import('tailwindcss').Config} */
export default {
    content: ["./*.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
    theme: {
        extend: {
            colors: {
                header: "#8B97C7",
                footer: "#242C4C",
                // Añadir color personalizado para el anillo de enfoque
                yellow: {
                    300: "#fde047", // Color del focus ring que usamos
                },
            },
            backgroundImage: {
                "space-background": "url('/public/assets/espacio-fondo.jpg')",
            },
            fontFamily: {
                "ibm-plex-mono": ['"IBM Plex Mono"', "monospace"],
            },
            // Añadir configuración para los anillos de enfoque
            ringWidth: {
                DEFAULT: "2px",
            },
            ringColor: {
                DEFAULT: "#fde047", // Mismo que yellow-300
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"), // Plugin para mejores estilos de formularios
    ],
};

