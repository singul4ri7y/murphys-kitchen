import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        dialog: "url('./images/modalBG.png')",
        "text-primary": "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
        "kitchen-pattern": "linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--accent)/0.1) 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2.5xl": "1.5rem",
        "3xl": "3.125rem",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        wrapper: "hsl(var(--card)/0.95)",
        "primary-overlay": "hsl(var(--background)/0.8)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        'fade-in': 'fade-in 0.2s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      boxShadow: {
        "wrapper-shadow": "0px 8px 32px 0px hsl(var(--primary)/0.1)",
        "button-shadow": "0px 4px 16px 0px hsl(var(--primary)/0.2)",
        "kitchen": "0px 4px 20px 0px hsl(var(--primary)/0.1)",
      },
      backdropBlur: {
        xs: "3px",
        sm: "10px",
      },
      fontSize: {
        xxs: ["0.625rem", "0.625rem"],
        "2xxs": ["0.5rem", "0.5rem"],
        "4.5xl": ["2.5rem", "2.5rem"],
        "6.5xl": ["4rem", "4rem"],
      },
      spacing: {
        17: "4.375rem",
        18: "4.5rem",
        30: "7.5rem",
        52: "13rem",
        64: "16rem", // 256px
      },
      width: {
        64: "16rem", // 256px
      },
      height: {
        64: "16rem", // 256px
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;