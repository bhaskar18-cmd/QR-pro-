import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { AppState } from '../../types';
import { Image as ImageIcon, Type, LayoutGrid, Upload, Search, Smartphone, X, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { ImageCropModal } from '../ImageCropModal';
import { CURATED_APPS, CATEGORIES, CuratedApp } from '../../data/curatedApps';
import { AddCustomAppModal } from '../AddCustomAppModal';
import { useTheme } from '../../ThemeContext';

interface BrandingTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const BrandingTab: React.FC<BrandingTabProps> = ({ state, setState }) => {
  const { isClean } = useTheme();
  const { branding } = state;
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [apiIcons, setApiIcons] = useState<any[]>([]);

  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [isAppSearching, setIsAppSearching] = useState(false);
  const [appResults, setAppResults] = useState<any[]>([]);

  // Persistent Custom Apps
  const [customApps, setCustomApps] = useState<CuratedApp[]>(() => {
    try {
      const saved = localStorage.getItem('qrcraft_user_custom_apps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [prefillAppName, setPrefillAppName] = useState('');

  const [brokenIcons, setBrokenIcons] = useState<Set<string>>(new Set());
  const [brokenAppIcons, setBrokenAppIcons] = useState<Set<string>>(new Set());

  // Persist custom apps
  useEffect(() => {
    try {
      localStorage.setItem('qrcraft_user_custom_apps', JSON.stringify(customApps));
    } catch (e) {
      console.error('Failed to persist custom apps', e);
    }
  }, [customApps]);

  const handleChange = (field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value,
      },
    }));
  };

  const handleAddCustomApp = (newApp: CuratedApp) => {
    setCustomApps((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
    handleChange('logoUrl', newApp.iconUrl);
    handleChange('type', 'app');
  };

  const handleDeleteCustomApp = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    const targetApp = customApps.find((a) => a.id === appId);
    setCustomApps((prev) => prev.filter((a) => a.id !== appId));
    if (targetApp && branding.logoUrl === targetApp.iconUrl) {
      handleChange('logoUrl', null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageUrl(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedUrl: string) => {
    handleChange('logoUrl', croppedUrl);
    handleChange('type', 'image');
    setIsCropModalOpen(false);
  };

  // Search Iconify API
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setApiIcons([]);
      setIsSearching(false);
      return;
    }

    const searchIconify = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=50`);
        const data = await response.json();
        if (data && data.icons) {
          const formattedIcons = data.icons.map((iconStr: string) => {
            // Iconify returns strings like "mdi:home"
            const parts = iconStr.split(':');
            return {
              id: parts[1] || iconStr,
              slug: iconStr
            };
          });
          setApiIcons(formattedIcons);
        }
      } catch (error) {
        console.error('Error fetching icons:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchIconify, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Search iTunes API for Real App Icons
  useEffect(() => {
    if (!appSearchQuery || appSearchQuery.length < 2) {
      setAppResults([]);
      setIsAppSearching(false);
      return;
    }

    const searchAppStore = async () => {
      setIsAppSearching(true);
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(appSearchQuery)}&entity=software&limit=15`);
        const data = await response.json();
        if (data && data.results) {
          setAppResults(data.results);
        }
      } catch (error) {
        console.error('Error fetching app icons:', error);
      } finally {
        setIsAppSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchAppStore, 500);
    return () => clearTimeout(debounceTimer);
  }, [appSearchQuery]);

  const appIcons = [
    { id: 'Facebook', slug: 'logos:facebook' },
    { id: 'Twitter / X', slug: 'logos:twitter' },
    { id: 'Instagram', slug: 'logos:instagram-icon' },
    { id: 'LinkedIn', slug: 'logos:linkedin-icon' },
    { id: 'YouTube', slug: 'logos:youtube-icon' },
    { id: 'WhatsApp', slug: 'logos:whatsapp-icon' },
    { id: 'Telegram', slug: 'logos:telegram' },
    { id: 'Discord', slug: 'logos:discord-icon' },
    { id: 'TikTok', slug: 'logos:tiktok-icon' },
    { id: 'Spotify', slug: 'logos:spotify-icon' },
    { id: 'Apple', slug: 'logos:apple' },
    { id: 'Google', slug: 'logos:google-icon' },
    { id: 'Microsoft', slug: 'logos:microsoft-icon' },
    { id: 'Netflix', slug: 'logos:netflix-icon' },
    { id: 'GitHub', slug: 'logos:github-icon' },
    { id: 'GitLab', slug: 'logos:gitlab' },
    { id: 'Slack', slug: 'logos:slack-icon' },
    { id: 'Figma', slug: 'logos:figma' },
    { id: 'Reddit', slug: 'logos:reddit-icon' },
    { id: 'Pinterest', slug: 'logos:pinterest' },
    { id: 'Twitch', slug: 'logos:twitch' },
    { id: 'Stripe', slug: 'logos:stripe' },
    { id: 'PayPal', slug: 'logos:paypal' },
    { id: 'Bitcoin', slug: 'logos:bitcoin' },
    { id: 'Ethereum', slug: 'logos:ethereum' },
    { id: 'React', slug: 'logos:react' },
    { id: 'Vue', slug: 'logos:vue' },
    { id: 'Angular', slug: 'logos:angular-icon' },
    { id: 'Node.js', slug: 'logos:nodejs-icon' },
    { id: 'Python', slug: 'logos:python' },
    { id: 'JavaScript', slug: 'logos:javascript' },
    { id: 'TypeScript', slug: 'logos:typescript-icon' },
    { id: 'HTML5', slug: 'logos:html-5' },
    { id: 'CSS3', slug: 'logos:css-3' },
    { id: 'Tailwind CSS', slug: 'logos:tailwindcss-icon' },
    { id: 'Firebase', slug: 'logos:firebase' },
    { id: 'Supabase', slug: 'logos:supabase-icon' },
    { id: 'Vercel', slug: 'logos:vercel-icon' },
    { id: 'AWS', slug: 'logos:aws' },
    { id: 'Docker', slug: 'logos:docker-icon' },
    { id: 'Android', slug: 'logos:android-icon' },
    { id: 'Chrome', slug: 'logos:chrome' },
    { id: 'Firefox', slug: 'logos:firefox' },
    { id: 'Safari', slug: 'logos:safari' },
    { id: 'Trello', slug: 'logos:trello' },
    { id: 'Jira', slug: 'logos:jira' },
    { id: 'Dropbox', slug: 'logos:dropbox' },
    { id: 'Google Drive', slug: 'logos:google-drive' },
    { id: 'Shopify', slug: 'logos:shopify' },
    { id: 'WordPress', slug: 'logos:wordpress-icon' },
    { id: 'Medium', slug: 'logos:medium-icon' },
    { id: 'Patreon', slug: 'logos:patreon' },
    { id: 'Stack Overflow', slug: 'logos:stackoverflow-icon' },
    { id: 'CodePen', slug: 'logos:codepen-icon' },
    { id: 'Framer', slug: 'logos:framer' },
    { id: 'Photoshop', slug: 'logos:adobe-photoshop' },
    { id: 'Illustrator', slug: 'logos:adobe-illustrator' },
    { id: 'PostgreSQL', slug: 'logos:postgresql' },
    { id: 'MongoDB', slug: 'logos:mongodb-icon' },
    { id: 'Redis', slug: 'logos:redis' },
    { id: 'GraphQL', slug: 'logos:graphql' },
    { id: 'Next.js', slug: 'logos:nextjs-icon' },
    { id: 'Nuxt.js', slug: 'logos:nuxtjs-icon' },
    { id: 'Svelte', slug: 'logos:svelte-icon' },
    { id: 'Vite', slug: 'logos:vitejs' },
    { id: 'Webpack', slug: 'logos:webpack' },
    { id: 'Babel', slug: 'logos:babel' },
    { id: 'Jest', slug: 'logos:jest' },
    { id: 'Playwright', slug: 'logos:playwright' },
    { id: 'Storybook', slug: 'logos:storybook-icon' },
    { id: 'NPM', slug: 'logos:npm-icon' },
    { id: 'Yarn', slug: 'logos:yarn' },
    { id: 'Bun', slug: 'logos:bun' },
    { id: 'Deno', slug: 'logos:deno' },
    { id: 'Vim', slug: 'logos:vim' },
    { id: 'VS Code', slug: 'logos:visual-studio-code' },
    { id: 'IntelliJ', slug: 'logos:intellij-idea' },
    { id: 'WebStorm', slug: 'logos:webstorm' },
    { id: 'Xcode', slug: 'logos:xcode' },
    { id: 'Postman', slug: 'logos:postman-icon' },
    { id: 'Swagger', slug: 'logos:swagger' },
    { id: 'OpenAI', slug: 'logos:openai-icon' },
    { id: 'TensorFlow', slug: 'logos:tensorflow' },
    { id: 'PyTorch', slug: 'logos:pytorch-icon' },
    { id: 'NumPy', slug: 'logos:numpy' },
    { id: 'D3.js', slug: 'logos:d3' },
    { id: 'Unity', slug: 'logos:unity' },
    { id: 'Blender', slug: 'logos:blender' },
  ];

  const displayedIcons = useMemo(() => {
    let icons = [];
    if (!searchQuery) {
      icons = appIcons;
    } else if (apiIcons.length > 0) {
      icons = apiIcons;
    } else {
      // Fallback to local search while loading or if API fails
      const fuse = new Fuse(appIcons, {
        keys: ['id', 'slug'],
        threshold: 0.4,
        distance: 100,
      });
      icons = fuse.search(searchQuery).map(result => result.item);
    }
    
    // Filter out broken icons
    return icons.filter(icon => !brokenIcons.has(icon.slug));
  }, [searchQuery, apiIcons, appIcons, brokenIcons]);

  const allCuratedAndCustom = useMemo(() => {
    return [...customApps, ...CURATED_APPS];
  }, [customApps]);

  const displayedApps = useMemo(() => {
    const query = appSearchQuery.trim().toLowerCase();

    if (query) {
      // 1. Filter local curated + custom apps
      const localMatches = allCuratedAndCustom.filter((app) =>
        app.name.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query) ||
        (app.badge && app.badge.toLowerCase().includes(query))
      );

      // 2. Map live iTunes search results
      const itunesMatches: CuratedApp[] = appResults
        .filter((app) => !brokenAppIcons.has(`itunes-${app.trackId}`))
        .map((app) => ({
          id: `itunes-${app.trackId}`,
          name: app.trackName,
          category: 'lifestyle' as const,
          iconUrl: app.artworkUrl512 || app.artworkUrl100,
          badge: 'Store',
        }));

      // Combine and deduplicate by app name
      const seenNames = new Set<string>();
      const combined: CuratedApp[] = [];

      for (const app of localMatches) {
        if (!seenNames.has(app.name.toLowerCase())) {
          seenNames.add(app.name.toLowerCase());
          combined.push(app);
        }
      }

      for (const app of itunesMatches) {
        if (!seenNames.has(app.name.toLowerCase())) {
          seenNames.add(app.name.toLowerCase());
          combined.push(app);
        }
      }

      return combined.filter((app) => !brokenAppIcons.has(app.id));
    }

    // No search query: filter by selected category
    let list = allCuratedAndCustom;
    if (selectedCategory === 'custom') {
      list = customApps;
    } else if (selectedCategory !== 'all') {
      list = allCuratedAndCustom.filter((app) => app.category === selectedCategory);
    }

    return list.filter((app) => !brokenAppIcons.has(app.id));
  }, [appSearchQuery, allCuratedAndCustom, appResults, brokenAppIcons, selectedCategory, customApps]);

  return (
    <div className="space-y-6">
      {/* Branding Type Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <button
          onClick={() => handleChange('type', 'none')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer min-h-[64px] ${
            branding.type === 'none'
              ? isClean
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                : 'bg-gradient-to-b from-indigo-950/70 to-slate-900/90 border-indigo-500/70 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/40'
              : isClean
                ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <X className="w-5 h-5 mb-1 shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">None</span>
        </button>
        <button
          onClick={() => handleChange('type', 'image')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer min-h-[64px] ${
            branding.type === 'image'
              ? isClean
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                : 'bg-gradient-to-b from-indigo-950/70 to-slate-900/90 border-indigo-500/70 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/40'
              : isClean
                ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <ImageIcon className="w-5 h-5 mb-1 shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">Custom Logo</span>
        </button>
        <button
          onClick={() => handleChange('type', 'text')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer min-h-[64px] ${
            branding.type === 'text'
              ? isClean
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                : 'bg-gradient-to-b from-indigo-950/70 to-slate-900/90 border-indigo-500/70 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/40'
              : isClean
                ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Type className="w-5 h-5 mb-1 shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">Monogram</span>
        </button>
        <button
          onClick={() => handleChange('type', 'icon')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer min-h-[64px] ${
            branding.type === 'icon'
              ? isClean
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                : 'bg-gradient-to-b from-indigo-950/70 to-slate-900/90 border-indigo-500/70 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/40'
              : isClean
                ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-1 shrink-0" />
          <span className="text-xs font-semibold text-center whitespace-nowrap">Tech Icon</span>
        </button>
        <button
          onClick={() => handleChange('type', 'app')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer min-h-[64px] col-span-2 sm:col-span-1 ${
            branding.type === 'app'
              ? isClean
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                : 'bg-gradient-to-b from-indigo-950/70 to-slate-900/90 border-indigo-500/70 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/40'
              : isClean
                ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Smartphone className="w-5 h-5 mb-1 shrink-0" />
          <span className="text-xs font-semibold text-center whitespace-nowrap">App Store</span>
        </button>
      </div>

      <div className={`p-6 rounded-2xl border transition-colors ${
        isClean
          ? 'bg-white border-slate-200/90 shadow-xs'
          : 'bg-slate-950/50 border-white/10 shadow-xl backdrop-blur-md'
      }`}>
        {branding.type === 'image' && (
          <div className="space-y-4">
            <label className={`block text-xs font-semibold uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
              Upload High-Res Brand Logo
            </label>
            <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all group cursor-pointer ${
              isClean
                ? 'border-slate-300 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/40'
                : 'border-white/15 hover:border-indigo-400/50 hover:bg-indigo-950/10'
            }`}>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                  isClean ? 'bg-blue-100 text-blue-600' : 'bg-indigo-500/20 text-indigo-400'
                }`}>
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${isClean ? 'text-slate-900' : 'text-white'}`}>
                    Click or drag image to upload & crop
                  </p>
                  <p className={`text-xs mt-1 ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                    PNG, SVG, or JPG with transparent or solid background
                  </p>
                </div>
              </div>
            </div>
            {branding.logoUrl && (
              <div className={`mt-4 flex items-center justify-between p-3.5 rounded-xl border ${
                isClean ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-white/10'
              }`}>
                <div className="flex items-center space-x-3">
                  <img
                    src={branding.logoUrl}
                    alt="Logo preview"
                    className={`w-10 h-10 rounded-lg object-contain p-1 border ${
                      isClean ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
                    }`}
                  />
                  <span className={`text-xs font-mono ${isClean ? 'text-slate-700' : 'text-slate-200'}`}>
                    Active Custom Logo Attached
                  </span>
                </div>
                <button
                  onClick={() => handleChange('logoUrl', null)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors cursor-pointer"
                >
                  Remove Logo
                </button>
              </div>
            )}
          </div>
        )}

        {branding.type === 'text' && (
          <div className="space-y-4">
            <label className={`block text-xs font-semibold uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
              Center Monogram / Text
            </label>
            <input
              type="text"
              maxLength={10}
              className={`w-full p-3 rounded-xl font-mono text-base transition-colors ${
                isClean
                  ? 'bg-white border border-slate-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 shadow-xs'
                  : 'bg-slate-900/80 border border-white/15 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 text-white placeholder:text-slate-500'
              }`}
              placeholder="e.g., QR, VIP, GO"
              value={branding.textValue}
              onChange={(e) => handleChange('textValue', e.target.value)}
            />
            <p className={`text-xs ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
              Maximum 10 characters. Automatically formatted as a clean circular center badge.
            </p>
          </div>
        )}

        {branding.type === 'icon' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className={`block text-xs font-semibold uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                Select Vector Tech Icon
              </label>
              <span className={`text-[11px] font-mono ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                {isSearching ? 'Querying Iconify...' : `${displayedIcons.length} available`}
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className={`w-full pl-10 p-3 rounded-xl text-sm transition-colors ${
                  isClean
                    ? 'bg-white border border-slate-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 shadow-xs'
                    : 'bg-slate-900 border border-white/15 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 text-white placeholder:text-slate-500'
                }`}
                placeholder="Search thousands of icons (e.g. react, apple, wifi, heart)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 max-h-64 overflow-y-auto p-1 custom-scrollbar">
              {displayedIcons.map((icon) => (
                <button
                  key={icon.slug}
                  onClick={() => handleChange('iconSlug', icon.slug)}
                  title={icon.id}
                  className={`aspect-square flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                    branding.iconSlug === icon.slug
                      ? isClean
                        ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500/30 scale-105'
                        : 'bg-indigo-600/30 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-105 ring-1 ring-indigo-300'
                      : isClean
                        ? 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white'
                        : 'bg-slate-900/60 border-white/10 hover:border-indigo-400/40 hover:bg-slate-800'
                  }`}
                >
                  <img
                    src={`https://api.iconify.design/${icon.slug.replace(':', '/')}.svg`}
                    alt={icon.id}
                    className="w-7 h-7"
                    onError={() => {
                      setBrokenIcons((prev) => new Set(prev).add(icon.slug));
                    }}
                  />
                </button>
              ))}
              {displayedIcons.length === 0 && !isSearching && (
                <div className={`col-span-5 sm:col-span-6 py-8 text-center text-xs ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                  No icons found matching "{searchQuery}"
                </div>
              )}
              {isSearching && displayedIcons.length === 0 && (
                <div className={`col-span-5 sm:col-span-6 py-8 text-center text-xs animate-pulse ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                  Searching Iconify database...
                </div>
              )}
            </div>
          </div>
        )}

        {branding.type === 'app' && (
          <div className="space-y-4">
            {/* Header with Title and Add New App Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
              <div>
                <div className="flex items-center space-x-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isClean ? 'text-slate-800' : 'text-white'}`}>
                    App Store & Custom Brand Directory
                  </label>
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                      isClean
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                    }`}
                  >
                    {displayedApps.length} Apps
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                  Choose from top modern apps or add any custom app to your QR center
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPrefillAppName(appSearchQuery.trim());
                  setIsAddModalOpen(true);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer ${
                  isClean
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Add New App</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 custom-scrollbar text-xs">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = cat.id === 'custom' ? customApps.length : undefined;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (appSearchQuery) setAppSearchQuery('');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center space-x-1 border cursor-pointer ${
                      isActive
                        ? isClean
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs font-semibold'
                          : 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : isClean
                          ? 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                          : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {count !== undefined && count > 0 && (
                      <span
                        className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                          isActive
                            ? isClean
                              ? 'bg-white/20 text-white'
                              : 'bg-amber-500/30 text-amber-200'
                            : isClean
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-amber-500/30 text-amber-200'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Search Input Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className={`w-full pl-10 pr-10 p-3 rounded-xl text-sm transition-colors ${
                  isClean
                    ? 'bg-white border border-slate-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 shadow-xs'
                    : 'bg-slate-900/90 border border-white/15 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 text-white placeholder:text-slate-500'
                }`}
                placeholder="Search 50+ apps (ChatGPT, TikTok, Spotify) or live App Store..."
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
              />
              {appSearchQuery && (
                <button
                  type="button"
                  onClick={() => setAppSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Smart Inline "Add This App" Banner if searching */}
            {appSearchQuery.length >= 2 && (
              <div
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  isClean
                    ? 'bg-blue-50/70 border-blue-200'
                    : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <Sparkles className={`w-4 h-4 flex-shrink-0 ${isClean ? 'text-blue-600' : 'text-amber-400'}`} />
                  <p className={`text-xs truncate ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                    Can't find <span className={`font-semibold ${isClean ? 'text-slate-900' : 'text-white'}`}>"{appSearchQuery}"</span>?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPrefillAppName(appSearchQuery.trim());
                    setIsAddModalOpen(true);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1 cursor-pointer ${
                    isClean
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      : 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Add "{appSearchQuery.slice(0, 15)}"</span>
                </button>
              </div>
            )}

            {/* App Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-1 custom-scrollbar">
              {displayedApps.map((app) => {
                const isSelected = branding.logoUrl === app.iconUrl;
                const isCustom = app.id.startsWith('custom-');

                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      handleChange('logoUrl', app.iconUrl);
                      handleChange('type', 'app');
                    }}
                    title={app.name}
                    className={`group relative flex flex-col items-center p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? isClean
                          ? 'bg-blue-50/90 border-blue-500 shadow-xs ring-1 ring-blue-500/30 scale-[1.02]'
                          : 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50 scale-[1.02]'
                        : isClean
                          ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                          : 'bg-slate-900/60 border-white/10 hover:border-amber-400/30 hover:bg-slate-850'
                    }`}
                  >
                    {/* Badge or Custom Indicator */}
                    {app.badge && (
                      <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                        isCustom
                          ? isClean ? 'bg-blue-600 text-white' : 'bg-amber-500 text-slate-950'
                          : app.badge === 'New' || app.badge === 'Trending'
                          ? isClean ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isClean ? 'bg-slate-200 text-slate-700 border border-slate-300' : 'bg-white/10 text-slate-300 border border-white/10'
                      }`}>
                        {app.badge}
                      </span>
                    )}

                    {/* Delete Custom App Button */}
                    {isCustom && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCustomApp(e, app.id)}
                        title="Delete custom app"
                        className="absolute top-1.5 right-1.5 p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    {/* App Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl p-1.5 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform overflow-hidden ${
                        isClean ? 'bg-white border border-slate-200' : 'bg-slate-950/80 border border-white/15 shadow-inner'
                      }`}
                    >
                      <img
                        src={app.iconUrl}
                        alt={app.name}
                        className="w-full h-full object-contain rounded-lg"
                        onError={() => {
                          setBrokenAppIcons((prev) => new Set(prev).add(app.id));
                        }}
                      />
                    </div>

                    {/* App Name */}
                    <span className={`text-[11px] font-semibold text-center truncate block w-full px-1 ${
                      isClean ? 'text-slate-800' : 'text-slate-200'
                    }`}>
                      {app.name}
                    </span>

                    {/* Selected Check Indicator */}
                    {isSelected && (
                      <div
                        className={`absolute bottom-1 right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-xs ${
                          isClean ? 'bg-blue-600 text-white' : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Empty States */}
              {displayedApps.length === 0 && !isAppSearching && (
                <div
                  className={`col-span-3 sm:col-span-4 py-8 px-4 text-center space-y-3 rounded-2xl border ${
                    isClean ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-white/5'
                  }`}
                >
                  <p className={`text-xs ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                    {appSearchQuery
                      ? `No apps found matching "${appSearchQuery}"`
                      : selectedCategory === 'custom'
                      ? "You haven't added any custom apps yet"
                      : "No apps found in this category"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPrefillAppName(appSearchQuery.trim());
                      setIsAddModalOpen(true);
                    }}
                    className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isClean
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add "{appSearchQuery || 'New App'}"</span>
                  </button>
                </div>
              )}

              {isAppSearching && displayedApps.length === 0 && (
                <div className={`col-span-3 sm:col-span-4 py-10 text-center text-xs flex flex-col items-center justify-center space-y-2 ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                  <div className={`w-5 h-5 border-2 rounded-full animate-spin ${isClean ? 'border-blue-600 border-t-transparent' : 'border-amber-400 border-t-transparent'}`} />
                  <span>Connecting to App Store & matching icons...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Branding Scale Slider */}
        <div className={`mt-8 pt-6 border-t ${isClean ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex justify-between items-center mb-3">
            <label className={`block text-xs font-semibold uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
              Logo Scale / Center Size
            </label>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                isClean
                  ? 'bg-slate-100 border-slate-200 text-blue-700'
                  : 'bg-white/5 border-white/10 text-indigo-300'
              }`}
            >
              {Math.round(branding.logoSize * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.05"
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
              isClean ? 'bg-slate-200 accent-blue-600' : 'bg-slate-800 accent-indigo-500'
            }`}
            value={branding.logoSize}
            onChange={(e) => handleChange('logoSize', parseFloat(e.target.value))}
          />
          <div className={`flex justify-between mt-2 text-[11px] font-mono ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Compact (10%)</span>
            <span>Prominent (50%)</span>
          </div>
        </div>
      </div>

      {isCropModalOpen && tempImageUrl && (
        <ImageCropModal
          imageUrl={tempImageUrl}
          onComplete={handleCropComplete}
          onCancel={() => setIsCropModalOpen(false)}
        />
      )}

      <AddCustomAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomApp}
        initialName={prefillAppName}
      />
    </div>
  );
};
