import { ThemeConfig } from './types';

export const defaultTheme: ThemeConfig = {
  name: '21 Blitz Maker',
  tagline: 'Create stacks of 21 without busting!',
  suitIcons: {
    hearts: '♥',
    diamonds: '♦', 
    clubs: '♣',
    spades: '♠'
  },
  heroTitleImageUrl: '/hero-diagram.png',
  cardBackUrl: '/generic-card-back.png',
  stackLabels: ['Stack 1', 'Stack 2', 'Stack 3', 'Stack 4'],
  scoringLabels: {
    score: 'Score',
    fumble: 'Fumbles'
  },
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
  },
  emojiPrefix: '✨',
  fontFamily: 'Inter',
  borderRadius: 12
};