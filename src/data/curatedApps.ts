export interface CuratedApp {
  id: string;
  name: string;
  category: 'ai' | 'social' | 'entertainment' | 'productivity' | 'finance' | 'lifestyle' | 'developer';
  iconUrl: string;
  badge?: string;
}

export const CATEGORIES = [
  { id: 'all', label: 'All Apps' },
  { id: 'ai', label: '🤖 AI & Smart' },
  { id: 'social', label: '💬 Social & Chat' },
  { id: 'entertainment', label: '🎬 Media & Music' },
  { id: 'productivity', label: '⚡ Productivity' },
  { id: 'finance', label: '💳 Finance & Pay' },
  { id: 'developer', label: '💻 Dev & Cloud' },
  { id: 'lifestyle', label: '🌟 Lifestyle' },
  { id: 'custom', label: '⭐ My Custom Apps' },
] as const;

export const CURATED_APPS: CuratedApp[] = [
  // AI & Smart Tools
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'ai',
    iconUrl: 'https://api.iconify.design/simple-icons:openai.svg?color=%2310a37f',
    badge: 'Popular',
  },
  {
    id: 'claude',
    name: 'Claude AI',
    category: 'ai',
    iconUrl: 'https://api.iconify.design/simple-icons:anthropic.svg?color=%23d97706',
    badge: 'Trending',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'ai',
    iconUrl: 'https://api.iconify.design/simple-icons:googlegemini.svg?color=%234285f4',
    badge: 'New',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    category: 'ai',
    iconUrl: 'https://api.iconify.design/simple-icons:perplexity.svg?color=%2320b2aa',
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    category: 'ai',
    iconUrl: 'https://api.iconify.design/simple-icons:microsoftcopilot.svg?color=%230078d4',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    category: 'ai',
    iconUrl: 'https://api.iconify.design/lucide:brain.svg?color=%233b82f6',
    badge: 'Hot',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'ai',
    iconUrl: 'https://api.iconify.design/simple-icons:midjourney.svg?color=%23ffffff',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    category: 'ai',
    iconUrl: 'https://api.iconify.design/logos:hugging-face-icon.svg',
  },

  // Social & Chat
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:tiktok-icon.svg',
    badge: 'Top',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:instagram-icon.svg',
    badge: 'Popular',
  },
  {
    id: 'threads',
    name: 'Threads',
    category: 'social',
    iconUrl: 'https://api.iconify.design/simple-icons:threads.svg?color=%23ffffff',
  },
  {
    id: 'x-twitter',
    name: 'X (Twitter)',
    category: 'social',
    iconUrl: 'https://api.iconify.design/simple-icons:x.svg?color=%23ffffff',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:whatsapp-icon.svg',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:telegram.svg',
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:discord-icon.svg',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:snapchat-icon.svg',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:reddit-icon.svg',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:linkedin-icon.svg',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:pinterest.svg',
  },
  {
    id: 'bereal',
    name: 'BeReal',
    category: 'social',
    iconUrl: 'https://api.iconify.design/simple-icons:bereal.svg?color=%23ffffff',
  },
  {
    id: 'signal',
    name: 'Signal',
    category: 'social',
    iconUrl: 'https://api.iconify.design/logos:signal.svg',
  },

  // Media & Entertainment
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'entertainment',
    iconUrl: 'https://api.iconify.design/logos:spotify-icon.svg',
    badge: 'Popular',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'entertainment',
    iconUrl: 'https://api.iconify.design/logos:youtube-icon.svg',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'entertainment',
    iconUrl: 'https://api.iconify.design/logos:netflix-icon.svg',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    category: 'entertainment',
    iconUrl: 'https://api.iconify.design/simple-icons:applemusic.svg?color=%23fa243c',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'entertainment',
    iconUrl: 'https://api.iconify.design/logos:twitch.svg',
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    category: 'entertainment',
    iconUrl: 'https://api.iconify.design/simple-icons:disneyplus.svg?color=%23113ccf',
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    category: 'entertainment',
    iconUrl: 'https://api.iconify.design/logos:soundcloud.svg',
  },

  // Productivity
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/logos:notion-icon.svg',
    badge: 'Top',
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/logos:figma.svg',
  },
  {
    id: 'canva',
    name: 'Canva',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/simple-icons:canva.svg?color=%2300c4cc',
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/logos:slack-icon.svg',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/logos:zoom-icon.svg',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/logos:google-drive.svg',
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/logos:trello.svg',
  },
  {
    id: 'linear',
    name: 'Linear',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/simple-icons:linear.svg?color=%235e6ad2',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/simple-icons:obsidian.svg?color=%237c3aed',
  },
  {
    id: 'microsoft-teams',
    name: 'MS Teams',
    category: 'productivity',
    iconUrl: 'https://api.iconify.design/logos:microsoft-teams.svg',
  },

  // Finance & Payment
  {
    id: 'cash-app',
    name: 'Cash App',
    category: 'finance',
    iconUrl: 'https://api.iconify.design/simple-icons:cashapp.svg?color=%2300d632',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'finance',
    iconUrl: 'https://api.iconify.design/logos:paypal.svg',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'finance',
    iconUrl: 'https://api.iconify.design/logos:stripe.svg',
  },
  {
    id: 'revolut',
    name: 'Revolut',
    category: 'finance',
    iconUrl: 'https://api.iconify.design/simple-icons:revolut.svg?color=%230075eb',
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    category: 'finance',
    iconUrl: 'https://api.iconify.design/logos:apple-pay.svg',
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    category: 'finance',
    iconUrl: 'https://api.iconify.design/logos:coinbase.svg',
  },
  {
    id: 'binance',
    name: 'Binance',
    category: 'finance',
    iconUrl: 'https://api.iconify.design/simple-icons:binance.svg?color=%23f3ba2f',
  },
  {
    id: 'venmo',
    name: 'Venmo',
    category: 'finance',
    iconUrl: 'https://api.iconify.design/logos:venmo.svg',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'finance',
    iconUrl: 'https://api.iconify.design/logos:shopify.svg',
  },

  // Developer & Cloud
  {
    id: 'github',
    name: 'GitHub',
    category: 'developer',
    iconUrl: 'https://api.iconify.design/logos:github-icon.svg',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'developer',
    iconUrl: 'https://api.iconify.design/logos:vercel-icon.svg',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'developer',
    iconUrl: 'https://api.iconify.design/logos:supabase-icon.svg',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'developer',
    iconUrl: 'https://api.iconify.design/logos:docker-icon.svg',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    category: 'developer',
    iconUrl: 'https://api.iconify.design/logos:firebase.svg',
  },

  // Lifestyle & Travel
  {
    id: 'uber',
    name: 'Uber',
    category: 'lifestyle',
    iconUrl: 'https://api.iconify.design/simple-icons:uber.svg?color=%23ffffff',
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    category: 'lifestyle',
    iconUrl: 'https://api.iconify.design/logos:airbnb-icon.svg',
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    category: 'lifestyle',
    iconUrl: 'https://api.iconify.design/logos:google-maps.svg',
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    category: 'lifestyle',
    iconUrl: 'https://api.iconify.design/logos:duolingo-icon.svg',
  },
  {
    id: 'strava',
    name: 'Strava',
    category: 'lifestyle',
    iconUrl: 'https://api.iconify.design/logos:strava.svg',
  },
];
