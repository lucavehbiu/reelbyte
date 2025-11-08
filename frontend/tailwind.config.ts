import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // ReelByte Brand Colors - Sophisticated Amsterdam Edition
        brand: {
          navy: {
            DEFAULT: '#1A2F4B',
            50: '#E8EDF3',
            100: '#D1DBE7',
            200: '#A3B7CF',
            300: '#7593B7',
            400: '#476F9F',
            500: '#1A2F4B',
            600: '#15263C',
            700: '#101C2D',
            800: '#0A131E',
            900: '#05090F',
          },
          gold: {
            DEFAULT: '#B28E4D',
            50: '#F8F4EC',
            100: '#F1E9D9',
            200: '#E3D3B3',
            300: '#D5BD8D',
            400: '#C7A767',
            500: '#B28E4D',
            600: '#8E723E',
            700: '#6B552E',
            800: '#47391F',
            900: '#241C0F',
          },
          copper: {
            DEFAULT: '#C48E66',
            50: '#F9F3ED',
            100: '#F3E7DB',
            200: '#E7CFB7',
            300: '#DBB793',
            400: '#CF9F6F',
            500: '#C48E66',
            600: '#9D7252',
            700: '#76553D',
            800: '#4E3929',
            900: '#271C14',
          },
          cream: {
            DEFAULT: '#FCFCF8',
            50: '#FFFFFF',
            100: '#FCFCF8',
            200: '#F8F8F8',
          },
          charcoal: {
            DEFAULT: '#333333',
            light: '#4A4A4A',
          },
          sage: {
            DEFAULT: '#6E8B7C',
            50: '#F1F4F2',
            100: '#E3E9E5',
          },
          teal: {
            DEFAULT: '#5C858C',
            50: '#EFF3F4',
          }
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        accent: ['Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config;
