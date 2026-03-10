import React from 'react';
import { AppState, ContentType } from '../../types';
import { Link, Wifi, Contact, Calendar } from 'lucide-react';

interface ContentTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const ContentTab: React.FC<ContentTabProps> = ({ state, setState }) => {
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
    { id: 'text', label: 'URL / Text', icon: Link },
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'vcard', label: 'Contact', icon: Contact },
    { id: 'vevent', label: 'Event', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTypeChange(t.id as ContentType)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
              content.type === t.id
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                : 'bg-white border-slate-200 text-black hover:bg-slate-50'
            }`}
          >
            <t.icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-bold">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {content.type === 'text' && (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-black">Content</label>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none h-32 text-black"
              placeholder="Enter URL or text..."
              value={content.text}
              onChange={(e) => handleChange('text', e.target.value)}
            />
          </div>
        )}

        {content.type === 'wifi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Network Name (SSID)</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.wifi.ssid}
                onChange={(e) => handleChange('wifi', e.target.value, 'ssid')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Password</label>
              <input
                type="password"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.wifi.password}
                onChange={(e) => handleChange('wifi', e.target.value, 'password')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Encryption</label>
                <select
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                  value={content.wifi.encryption}
                  onChange={(e) => handleChange('wifi', e.target.value, 'encryption')}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
              <div className="flex items-center mt-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    checked={content.wifi.hidden}
                    onChange={(e) => handleChange('wifi', e.target.checked, 'hidden')}
                  />
                  <span className="text-sm font-bold text-black">Hidden Network</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {content.type === 'vcard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">First Name</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.vcard.firstName}
                onChange={(e) => handleChange('vcard', e.target.value, 'firstName')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Last Name</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.vcard.lastName}
                onChange={(e) => handleChange('vcard', e.target.value, 'lastName')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Phone</label>
              <input
                type="tel"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.vcard.phone}
                onChange={(e) => handleChange('vcard', e.target.value, 'phone')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Email</label>
              <input
                type="email"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.vcard.email}
                onChange={(e) => handleChange('vcard', e.target.value, 'email')}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-black mb-1">Company</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.vcard.company}
                onChange={(e) => handleChange('vcard', e.target.value, 'company')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Job Title</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.vcard.jobTitle}
                onChange={(e) => handleChange('vcard', e.target.value, 'jobTitle')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Website</label>
              <input
                type="url"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.vcard.website}
                onChange={(e) => handleChange('vcard', e.target.value, 'website')}
              />
            </div>
          </div>
        )}

        {content.type === 'vevent' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Event Title</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.vevent.title}
                onChange={(e) => handleChange('vevent', e.target.value, 'title')}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Location</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                value={content.vevent.location}
                onChange={(e) => handleChange('vevent', e.target.value, 'location')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
                  value={content.vevent.startTime}
                  onChange={(e) => handleChange('vevent', e.target.value, 'startTime')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-black"
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
