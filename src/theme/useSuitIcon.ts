import { useTheme } from './ThemeContext';

// Map the app's current suit emojis to standardized suit names
const suitMap: Record<string, keyof NonNullable<NonNullable<ReturnType<typeof useTheme>['theme']['suitIcons']>>> = {
  '❤️': 'hearts',
  '✨': 'diamonds', 
  '✍️': 'clubs',
  '🎤': 'spades'
};

export const useSuitIcon = () => {
  const { theme } = useTheme();
  
  const iconFor = (suit: string): string => {
    const suitName = suitMap[suit];
    if (suitName && theme.suitIcons?.[suitName]) {
      return theme.suitIcons[suitName]!;
    }
    return suit; // Fallback to original suit emoji
  };

  return { iconFor };
};