export interface ThemeConfig {
  cardBackUrl?: string;
  suitIcons?: {
    hearts?: string;
    diamonds?: string; 
    clubs?: string;
    spades?: string;
  };
  heroTitleImageUrl?: string;
  stackLabels?: string[];
  scoringLabels?: {
    score?: string;
    fumble?: string;
  };
  colors?: {
    background?: string;
    surface?: string;
    primary?: string;
    secondary?: string;
    accent?: string;
    textPrimary?: string;
    textSecondary?: string;
    gradientFrom?: string;
    gradientTo?: string;
  };
  emojiPrefix?: string;
  fontFamily?: string;
  borderRadius?: number;
}

export interface ThemePreset {
  name: string;
  config: ThemeConfig;
}

export interface SavedTheme {
  id: string;
  owner_id?: string;
  name: string;
  config: ThemeConfig;
  created_at: string;
  updated_at: string;
}