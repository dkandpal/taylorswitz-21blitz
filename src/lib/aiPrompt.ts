/**
 * Build the AI prompt string from a title and description.
 * The prompt instructs the AI to return a JSON object with keys for images,
 * labels, colors and a tagline. It includes guidelines and an example.
 */
export function buildAiPrompt(title: string, description: string): string {
  return `Act as a creative design assistant for a 21‑Blitz card game.
You will receive a game title and a short description of the game's theme and mood.
Your task is to produce a complete theme specification for the game, covering images, labels, colors, and a tagline.

Respond **strictly in JSON** with the following keys:
{
  "cardBack":      "…",      // description of the card back image
  "suitIcons": {             // four simple icons, one per suit
    "hearts": "…",
    "diamonds": "…",
    "clubs": "…",
    "spades": "…"
  },
  "heroImage":    "…",      // description of the hero/banner image
  "stackCategories": ["…","…","…","…"],  // four stack names
  "scoringLabels": {         // playful names for score & fumbles
    "score":   "…",
    "fumbles": "…"
  },
  "colors": ["…","…","…", …], // up to six hex codes that match the theme
  "tagline":      "…"        // a short, catchy tagline
}

Guidelines:
1. **Card back** – Describe the central emblem or motif for the backs of all cards. It should encapsulate the theme and work well as a repeating pattern. Mention style and palette.
2. **Suit icons** – Describe four emoji‑like symbols that replace hearts, diamonds, clubs and spades. Each icon should connect directly to the theme and be rendered in a consistent style.
3. **Hero image** – Describe an eye‑catching hero/banner image for the main screen. It should show the energy of Blitz 21 and include the game title integrated into the design.
4. **Stack categories** – Provide four playful stack names (1–2 words) relevant to the theme.
5. **Scoring labels** – Provide two short, energetic phrases for score and fumbles counters.
6. **Colors** – Suggest up to six hex color codes that reflect the theme and work well together for UI elements.
7. **Tagline** – Craft a short, motivational tagline (1–2 sentences) encouraging players to stack cards in the spirit of the theme.

Example input: Game Title: Brooklyn Nets Basketball
Example output:
{
  "cardBack": "A bold, modern depiction of the Brooklyn Nets logo centered on a dark basketball‑court texture, black and white with silver accents.",
  "suitIcons": {
    "hearts": "a basketball icon",
    "diamonds": "a hoop and net icon",
    "clubs": "a referee whistle icon",
    "spades": "a slam‑dunk silhouette icon"
  },
  "heroImage": "An action shot of a Nets player soaring above the court, with neon motion streaks and the title 'Nets 21' incorporated into the design.",
  "stackCategories": ["Dunks","Threes","Rebounds","Assists"],
  "scoringLabels": { "score": "Swish!", "fumbles": "Air Ball" },
  "colors": ["#000000","#FFFFFF","#0072CE","#A1A1A1"],
  "tagline": "Stack buckets like the Nets!"
}

Now generate the theme specification for the following:
Game Title: ${title}
Description: ${description}
`;
}