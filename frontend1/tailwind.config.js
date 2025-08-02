/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "var(--color-primary)",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
        },
        animation: {
          'bounce-subtle': 'bounce-subtle 2s infinite',
          'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
          'gradient-x': 'gradient-x 15s ease infinite',
          'float': 'float 6s ease-in-out infinite',
          'float-delayed': 'float-delayed 8s ease-in-out infinite',
        },
        keyframes: {
          'bounce-subtle': {
            '0%, 100%': {
              transform: 'translateY(-5%)',
              animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
            },
            '50%': {
              transform: 'none',
              animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
            },
          },
          'pulse-glow': {
            'from': {
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
            },
            'to': {
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
            },
          },
          'gradient-x': {
            '0%, 100%': {
              'background-size': '200% 200%',
              'background-position': 'left center'
            },
            '50%': {
              'background-size': '200% 200%',
              'background-position': 'right center'
            },
          },
        },
        backdropBlur: {
          xs: '2px',
        },
        fontSize: {
          '2xs': '0.625rem',
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }