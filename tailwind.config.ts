import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Brand color system
        brand: {
          bg: "hsl(var(--brand-bg))",
          surface: "hsl(var(--brand-surface))",
          surface2: "hsl(var(--brand-surface-2))",
          accent: "hsl(var(--brand-accent))",
          accent2: "hsl(var(--brand-accent-2))",
          text: "hsl(var(--brand-text))",
          muted: "hsl(var(--brand-muted))",
          border: "hsl(var(--brand-border))",
        },
        
        // Button tokens
        btn: {
          primary: "hsl(var(--btn-primary-bg))",
          primaryText: "hsl(var(--btn-primary-text))",
          danger: "hsl(var(--btn-danger-bg))",
          dangerText: "hsl(var(--btn-danger-text))",
          neutral: "hsl(var(--btn-neutral-bg))",
          neutralText: "hsl(var(--btn-neutral-text))",
        },
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          shadow: "hsl(var(--card-shadow))",
        },
        game: {
          surface: "hsl(var(--game-surface))",
          border: "hsl(var(--game-border))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          glow: "hsl(var(--success-glow))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
          glow: "hsl(var(--danger-glow))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          glow: "hsl(var(--warning-glow))",
        },
        hotPink: {
          DEFAULT: "hsl(var(--hot-pink))",
          foreground: "hsl(var(--hot-pink-foreground))",
        },
        lightGreen: {
          DEFAULT: "hsl(var(--light-green))",
          foreground: "hsl(var(--light-green-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "success-pulse": "success-pulse 0.6s ease-out",
        "danger-shake": "danger-shake 0.6s ease-out",
        "confetti-burst": "confetti-burst 0.8s ease-out",
        "card-hover": "card-hover 0.3s ease-out",
        "timer-pulse": "timer-pulse 1s ease-in-out infinite",
        "amber-pulse": "amber-pulse 1.5s ease-in-out infinite",
        "green-flash": "green-flash 0.6s ease-out",
        "red-shake": "red-shake 0.4s ease-out",
        "container-shake": "container-shake 0.4s ease-out",
        "red-flash": "red-flash 0.4s ease-out",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-surface": "var(--gradient-surface)",
        "gradient-card": "var(--gradient-card)",
        "brand-gradient": "linear-gradient(180deg, hsl(var(--brand-gradient-from)), hsl(var(--brand-gradient-to)))",
      },
      boxShadow: {
        "card": "var(--shadow-card)",
        "success": "var(--shadow-success)",
        "danger": "var(--shadow-danger)",
        "warning": "var(--shadow-warning)",
        "brand-card": "0 8px 20px hsl(var(--brand-bg) / 0.25)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
