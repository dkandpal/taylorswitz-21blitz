import { ThemePreset } from './types';

export const themePresets: ThemePreset[] = [
  {
    name: 'Taylor Pink',
    config: {
      colors: {
        background: 'hsl(330, 81%, 96%)',
        surface: 'hsl(0, 0%, 100%)',
        primary: 'hsl(330, 81%, 60%)',
        secondary: 'hsl(330, 81%, 80%)',
        accent: 'hsl(330, 81%, 40%)',
        textPrimary: 'hsl(330, 81%, 10%)',
        textSecondary: 'hsl(330, 30%, 40%)',
        gradientFrom: 'hsl(330, 81%, 60%)',
        gradientTo: 'hsl(330, 81%, 80%)'
      }
    }
  },
  {
    name: 'Mint Fresh',
    config: {
      colors: {
        background: 'hsl(150, 60%, 96%)',
        surface: 'hsl(0, 0%, 100%)',
        primary: 'hsl(150, 60%, 50%)',
        secondary: 'hsl(150, 60%, 70%)',
        accent: 'hsl(150, 60%, 30%)',
        textPrimary: 'hsl(150, 60%, 10%)',
        textSecondary: 'hsl(150, 30%, 40%)',
        gradientFrom: 'hsl(150, 60%, 50%)',
        gradientTo: 'hsl(150, 60%, 70%)'
      }
    }
  },
  {
    name: 'Dark Mode',
    config: {
      colors: {
        background: 'hsl(220, 13%, 9%)',
        surface: 'hsl(220, 13%, 15%)',
        primary: 'hsl(210, 40%, 60%)',
        secondary: 'hsl(210, 40%, 40%)',
        accent: 'hsl(210, 40%, 80%)',
        textPrimary: 'hsl(0, 0%, 95%)',
        textSecondary: 'hsl(0, 0%, 70%)',
        gradientFrom: 'hsl(210, 40%, 60%)',
        gradientTo: 'hsl(210, 40%, 40%)'
      }
    }
  },
  {
    name: 'Pastel Dream',
    config: {
      colors: {
        background: 'hsl(270, 50%, 96%)',
        surface: 'hsl(0, 0%, 100%)',
        primary: 'hsl(270, 50%, 70%)',
        secondary: 'hsl(270, 50%, 85%)',
        accent: 'hsl(270, 50%, 50%)',
        textPrimary: 'hsl(270, 50%, 15%)',
        textSecondary: 'hsl(270, 30%, 40%)',
        gradientFrom: 'hsl(270, 50%, 70%)',
        gradientTo: 'hsl(270, 50%, 85%)'
      }
    }
  },
  {
    name: 'Retro Arcade',
    config: {
      colors: {
        background: 'hsl(45, 100%, 95%)',
        surface: 'hsl(0, 0%, 100%)',
        primary: 'hsl(45, 100%, 50%)',
        secondary: 'hsl(30, 100%, 60%)',
        accent: 'hsl(15, 100%, 50%)',
        textPrimary: 'hsl(0, 0%, 10%)',
        textSecondary: 'hsl(0, 0%, 40%)',
        gradientFrom: 'hsl(45, 100%, 50%)',
        gradientTo: 'hsl(30, 100%, 60%)'
      }
    }
  },
  {
    name: 'Neon Nights',
    config: {
      colors: {
        background: 'hsl(240, 100%, 5%)',
        surface: 'hsl(240, 100%, 10%)',
        primary: 'hsl(300, 100%, 60%)',
        secondary: 'hsl(180, 100%, 60%)',
        accent: 'hsl(60, 100%, 60%)',
        textPrimary: 'hsl(0, 0%, 95%)',
        textSecondary: 'hsl(0, 0%, 70%)',
        gradientFrom: 'hsl(300, 100%, 60%)',
        gradientTo: 'hsl(180, 100%, 60%)'
      }
    }
  }
];