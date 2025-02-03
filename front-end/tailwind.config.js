// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files in the src folder
      "./public/index.html",        // Include your HTML file
    ],
    theme: {
      extend: {
        colors: {
          // Add custom colors if needed
          amazon: "#232F3E", // Example: Amazon navbar color
        },
      },
    },
    plugins: [],
    darkMode: "class", // Enable dark mode using the 'class' strategy
  };