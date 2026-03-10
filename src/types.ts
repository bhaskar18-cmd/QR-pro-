export type ContentType = 'text' | 'wifi' | 'vcard' | 'vevent';

export interface WifiData {
  ssid: string;
  password?: string;
  encryption: 'WEP' | 'WPA' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  website: string;
}

export interface VEventData {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
}

export interface ContentState {
  type: ContentType;
  text: string;
  wifi: WifiData;
  vcard: VCardData;
  vevent: VEventData;
}

export interface StyleState {
  isAdvanced: boolean;
  dotsType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  cornersSquareType: 'dot' | 'square' | 'extra-rounded';
  cornersDotType: 'dot' | 'square';
  fgColor: string;
  bgColor: string;
  bgImage: string | null;
  gradientEnabled: boolean;
  gradientStart: string;
  gradientEnd: string;
  gradientType: 'linear' | 'radial';
  gradientRotation: number;
}

export interface BrandingState {
  type: 'image' | 'text' | 'icon' | 'app' | 'none';
  logoUrl: string | null;
  textValue: string;
  iconSlug: string;
  logoSize: number;
}

export interface AdvancedState {
  resolution: number;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export interface AppState {
  content: ContentState;
  style: StyleState;
  branding: BrandingState;
  advanced: AdvancedState;
}
