import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { AppState } from '../../types';
import { Image as ImageIcon, Type, LayoutGrid, Upload, Search, Smartphone } from 'lucide-react';
import { ImageCropModal } from '../ImageCropModal';

interface BrandingTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const BrandingTab: React.FC<BrandingTabProps> = ({ state, setState }) => {
  const { branding } = state;
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [apiIcons, setApiIcons] = useState<any[]>([]);

  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [isAppSearching, setIsAppSearching] = useState(false);
  const [appResults, setAppResults] = useState<any[]>([]);

  const handleChange = (field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value,
      },
    }));
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
    if (!searchQuery) return appIcons;
    
    // If we have API results, use those
    if (apiIcons.length > 0) return apiIcons;

    // Fallback to local search while loading or if API fails
    const fuse = new Fuse(appIcons, {
      keys: ['id', 'slug'],
      threshold: 0.4,
      distance: 100,
    });
    
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, apiIcons, appIcons]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={() => handleChange('type', 'image')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
            branding.type === 'image'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
              : 'bg-white border-slate-200 text-black hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-5 h-5 mb-2" />
          <span className="text-xs font-bold">Image</span>
        </button>
        <button
          onClick={() => handleChange('type', 'text')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
            branding.type === 'text'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
              : 'bg-white border-slate-200 text-black hover:bg-slate-50'
          }`}
        >
          <Type className="w-5 h-5 mb-2" />
          <span className="text-xs font-bold">Text</span>
        </button>
        <button
          onClick={() => handleChange('type', 'icon')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
            branding.type === 'icon'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
              : 'bg-white border-slate-200 text-black hover:bg-slate-50'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-2" />
          <span className="text-xs font-bold text-center">Vector Icon</span>
        </button>
        <button
          onClick={() => handleChange('type', 'app')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
            branding.type === 'app'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
              : 'bg-white border-slate-200 text-black hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-5 h-5 mb-2" />
          <span className="text-xs font-bold text-center">Real App</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {branding.type === 'image' && (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-black">Upload Logo</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">Click or drag image to upload</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, SVG up to 5MB</p>
                </div>
              </div>
            </div>
            {branding.logoUrl && (
              <div className="mt-4 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <img src={branding.logoUrl} alt="Logo preview" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                  <span className="text-sm font-bold text-black">Current Logo</span>
                </div>
                <button
                  onClick={() => handleChange('logoUrl', null)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}

        {branding.type === 'text' && (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-black">Logo Text</label>
            <input
              type="text"
              maxLength={10}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="e.g., QRCRAFT"
              value={branding.textValue}
              onChange={(e) => handleChange('textValue', e.target.value)}
            />
            <p className="text-xs font-bold text-black">Max 10 characters. Colors will match your Style settings.</p>
          </div>
        )}

        {branding.type === 'icon' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-700">Select App Icon</label>
              <span className="text-xs text-slate-500">
                {isSearching ? 'Searching...' : `${displayedIcons.length} icons`}
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Search over 100,000+ icons (e.g., free fire, grow)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-5 gap-3 max-h-64 overflow-y-auto p-1 custom-scrollbar">
              {displayedIcons.map((icon) => (
                <button
                  key={icon.slug}
                  onClick={() => handleChange('iconSlug', icon.slug)}
                  title={icon.id}
                  className={`aspect-square flex items-center justify-center rounded-xl border transition-all ${
                    branding.iconSlug === icon.slug
                      ? 'bg-indigo-50 border-indigo-400 shadow-sm scale-105'
                      : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={`https://api.iconify.design/${icon.slug.replace(':', '/')}.svg`}
                    alt={icon.id}
                    className="w-8 h-8"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </button>
              ))}
              {displayedIcons.length === 0 && !isSearching && (
                <div className="col-span-5 py-8 text-center text-slate-500 text-sm">
                  No icons found matching "{searchQuery}"
                </div>
              )}
              {isSearching && displayedIcons.length === 0 && (
                <div className="col-span-5 py-8 text-center text-slate-500 text-sm animate-pulse">
                  Searching Iconify database...
                </div>
              )}
            </div>
          </div>
        )}

        {branding.type === 'app' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-700">Search Real App Icons</label>
              <span className="text-xs text-slate-500">
                {isAppSearching ? 'Searching...' : `${appResults.length} apps`}
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Search App Store (e.g., Free Fire, Groww, Instagram)..."
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 gap-4 max-h-64 overflow-y-auto p-1 custom-scrollbar">
              {appResults.map((app) => (
                <button
                  key={app.trackId}
                  onClick={() => handleChange('logoUrl', app.artworkUrl512)}
                  title={app.trackName}
                  className={`flex flex-col items-center space-y-2 p-2 rounded-xl border transition-all ${
                    branding.logoUrl === app.artworkUrl512
                      ? 'bg-indigo-50 border-indigo-400 shadow-sm scale-105'
                      : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={app.artworkUrl512}
                    alt={app.trackName}
                    className="w-12 h-12 rounded-xl shadow-sm"
                  />
                  <span className="text-[10px] font-medium text-slate-600 text-center line-clamp-2 leading-tight">
                    {app.trackName}
                  </span>
                </button>
              ))}
              {appResults.length === 0 && !isAppSearching && appSearchQuery.length >= 2 && (
                <div className="col-span-4 py-8 text-center text-slate-500 text-sm">
                  No apps found matching "{appSearchQuery}"
                </div>
              )}
              {appResults.length === 0 && !isAppSearching && appSearchQuery.length < 2 && (
                <div className="col-span-4 py-8 text-center text-slate-500 text-sm">
                  Type an app name to search...
                </div>
              )}
              {isAppSearching && appResults.length === 0 && (
                <div className="col-span-4 py-8 text-center text-slate-500 text-sm animate-pulse">
                  Searching App Store...
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-slate-700">Branding Scale</label>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
              {Math.round(branding.logoSize * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.05"
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            value={branding.logoSize}
            onChange={(e) => handleChange('logoSize', parseFloat(e.target.value))}
          />
          <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
            <span>Small</span>
            <span>Large</span>
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
    </div>
  );
};
