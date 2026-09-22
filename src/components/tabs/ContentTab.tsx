import React from 'react';
import { AppState, ContentType } from '../../types';
import { Link2, Wifi, UserSquare2, CalendarDays, Sparkles } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

interface ContentTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const ContentTab: React.FC<ContentTabProps> = ({ state, setState }) => {
  const { isClean } = useTheme();
  const { content } = state;

  const handleTypeChange = (type: ContentType) => {
    setState((prev) => ({ ...prev, content: { ...prev.content, type } }));
  };

  const handleChange = (field: string, value: any, subfield?: string) => {
    setState((prev) => {
      if (subfield) {
        return {
          ...prev,
          content: {
            ...prev.content,
            [field]: {
              ...(prev.content as any)[field],
              [subfield]: value,
            },
          },
        };
      }
      return {
        ...prev,
        content: {
          ...prev.content,
          [field]: value,
        },
      };
    });
  };

  const types = [
    { id: 'text', label: 'URL / Text', icon: Link2, desc: 'Links, notes, raw text' },
    { id: 'wifi', label: 'Wi-Fi Access', icon: Wifi, desc: 'Instant 1-tap join' },
    { id: 'vcard', label: 'vCard Contact', icon: UserSquare2, desc: 'Full digital profile' },
    { id: 'vevent', label: 'Calendar Event', icon: CalendarDays, desc: 'Add event to phone' },
  ];

  const quickUrls = [
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'Portfolio', url: 'https://portfolio.dev' },
    { label: 'LinkedIn', url: 'https://linkedin.com' },
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'YouTube', url: 'https://youtube.com' },
  ];

  const inputClass = isClean
    ? 'w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-all font-sans'
    : 'w-full p-3 bg-slate-900/80 border border-white/15 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 text-white placeholder:text-slate-500 transition-all font-sans';

  const labelClass = isClean
    ? 'block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider'
    : 'block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider';

  return (
    <div className="space-y-6">
      {/* Type Selector Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {types.map((t) => {
          const Icon = t.icon;
          const isSelected = content.type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTypeChange(t.id as ContentType)}
              className={`group relative flex flex-col items-start p-3.5 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                isSelected
                  ? isClean
                    ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-gradient-to-b from-indigo-950/60 to-slate-900/90 border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/30'
                  : isClean
                    ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                    : 'bg-slate-950/40 border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isSelected
                      ? isClean
                        ? 'bg-blue-600 text-white'
                        : 'bg-indigo-500/20 text-indigo-300'
                      : isClean
                        ? 'bg-slate-100 text-slate-600 group-hover:text-slate-900'
                        : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isClean ? 'bg-blue-600' : 'bg-indigo-400 shadow-[0_0_8px_#818cf8]'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-sm font-bold truncate w-full ${
                  isSelected
                    ? isClean
                      ? 'text-blue-900'
                      : 'text-white'
                    : isClean
                      ? 'text-slate-800'
                      : 'text-slate-200'
                }`}
              >
                {t.label}
              </span>
              <span
                className={`text-[11px] mt-0.5 font-normal truncate w-full ${
                  isSelected && isClean ? 'text-blue-700/80' : isClean ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {t.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inputs Form Card */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
          isClean
            ? 'bg-white border-slate-200/90 shadow-xs'
            : 'bg-slate-950/50 border-white/10 shadow-xl backdrop-blur-md'
        }`}
      >
        {content.type === 'text' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className={`text-sm font-semibold flex items-center gap-2 ${isClean ? 'text-slate-800' : 'text-white'}`}>
                <span>Destination Payload (URL or Message)</span>
              </label>
              <span className={`text-[11px] font-mono shrink-0 ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                {content.text.length} chars
              </span>
            </div>

            <textarea
              className={`w-full p-3.5 rounded-xl border focus:ring-2 resize-none h-32 font-mono text-sm transition-all ${
                isClean
                  ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-blue-500/30 focus:border-blue-500 shadow-xs'
                  : 'bg-slate-900/80 border-white/15 text-white placeholder:text-slate-500 focus:ring-indigo-500/50 focus:border-indigo-400 focus:bg-slate-900 shadow-inner'
              }`}
              placeholder="https://yourwebsite.com or any text..."
              value={content.text}
              onChange={(e) => handleChange('text', e.target.value)}
            />

            {/* Quick URL Suggestions */}
            <div>
              <div className={`flex items-center space-x-1.5 text-xs mb-2 ${isClean ? 'text-slate-600' : 'text-slate-400'}`}>
                <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isClean ? 'text-blue-600' : 'text-indigo-400'}`} />
                <span>Quick Fill Suggestions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickUrls.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleChange('text', item.url)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-mono whitespace-nowrap cursor-pointer transition-colors ${
                      isClean
                        ? 'bg-slate-100 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700'
                        : 'bg-white/5 hover:bg-indigo-600/20 border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {content.type === 'wifi' && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Network Name (SSID)</label>
              <input
                type="text"
                placeholder="e.g. Guest_Wi-Fi"
                className={inputClass}
                value={content.wifi.ssid}
                onChange={(e) => handleChange('wifi', e.target.value, 'ssid')}
              />
            </div>
            <div>
              <label className={labelClass}>Wi-Fi Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className={inputClass}
                value={content.wifi.password}
                onChange={(e) => handleChange('wifi', e.target.value, 'password')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Encryption Security</label>
                <select
                  className={inputClass}
                  value={content.wifi.encryption}
                  onChange={(e) => handleChange('wifi', e.target.value, 'encryption')}
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">Open Network (No Password)</option>
                </select>
              </div>
              <div className="flex items-center sm:pt-6">
                <label
                  className={`flex items-center space-x-3 cursor-pointer p-2.5 rounded-xl border w-full transition-colors ${
                    isClean
                      ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    checked={content.wifi.hidden}
                    onChange={(e) => handleChange('wifi', e.target.checked, 'hidden')}
                  />
                  <span className={`text-xs font-medium ${isClean ? 'text-slate-700' : 'text-slate-200'}`}>
                    Hidden Network (Don't broadcast SSID)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {content.type === 'vcard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                placeholder="John"
                className={inputClass}
                value={content.vcard.firstName}
                onChange={(e) => handleChange('vcard', e.target.value, 'firstName')}
              />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className={inputClass}
                value={content.vcard.lastName}
                onChange={(e) => handleChange('vcard', e.target.value, 'lastName')}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className={inputClass}
                value={content.vcard.phone}
                onChange={(e) => handleChange('vcard', e.target.value, 'phone')}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className={inputClass}
                value={content.vcard.email}
                onChange={(e) => handleChange('vcard', e.target.value, 'email')}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Company / Organization</label>
              <input
                type="text"
                placeholder="Acme Studio"
                className={inputClass}
                value={content.vcard.company}
                onChange={(e) => handleChange('vcard', e.target.value, 'company')}
              />
            </div>
            <div>
              <label className={labelClass}>Job Title</label>
              <input
                type="text"
                placeholder="Product Architect"
                className={inputClass}
                value={content.vcard.jobTitle}
                onChange={(e) => handleChange('vcard', e.target.value, 'jobTitle')}
              />
            </div>
            <div>
              <label className={labelClass}>Personal Website</label>
              <input
                type="url"
                placeholder="https://johndoe.com"
                className={inputClass}
                value={content.vcard.website}
                onChange={(e) => handleChange('vcard', e.target.value, 'website')}
              />
            </div>
          </div>
        )}

        {content.type === 'vevent' && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Event Title</label>
              <input
                type="text"
                placeholder="Business Conference 2026"
                className={inputClass}
                value={content.vevent.title}
                onChange={(e) => handleChange('vevent', e.target.value, 'title')}
              />
            </div>
            <div>
              <label className={labelClass}>Location or Meeting Link</label>
              <input
                type="text"
                placeholder="Convention Center / Video Call"
                className={inputClass}
                value={content.vevent.location}
                onChange={(e) => handleChange('vevent', e.target.value, 'location')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Time</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={content.vevent.startTime}
                  onChange={(e) => handleChange('vevent', e.target.value, 'startTime')}
                />
              </div>
              <div>
                <label className={labelClass}>End Time</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={content.vevent.endTime}
                  onChange={(e) => handleChange('vevent', e.target.value, 'endTime')}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

