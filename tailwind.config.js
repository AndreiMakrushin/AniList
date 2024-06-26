/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                'shadowDrop': '0 20px 40px 0 rgba(0,0,0,.3)'
            },
            transitionDuration: {
                'short': '0.3s'
            },
            backgroundColor: {
                'cardOpacity': 'rgba(0, 0, 0, 0.5)',
                'cardOpacity2': 'rgba(0, 0, 0, 0.3)'
            }

        },

    },
    plugins: [],
}