import { AppState, ContentState } from '../types';
import { Options } from 'qr-code-styling';

export const generateQRData = (content: ContentState): string => {
  switch (content.type) {
    case 'text':
      return content.text;
    case 'wifi':
      return `WIFI:S:${content.wifi.ssid};T:${content.wifi.encryption};P:${content.wifi.password || ''};H:${content.wifi.hidden};;`;
    case 'vcard':
      return `BEGIN:VCARD\nVERSION:3.0\nN:${content.vcard.lastName};${content.vcard.firstName}\nFN:${content.vcard.firstName} ${content.vcard.lastName}\nORG:${content.vcard.company}\nTITLE:${content.vcard.jobTitle}\nTEL:${content.vcard.phone}\nEMAIL:${content.vcard.email}\nURL:${content.vcard.website}\nEND:VCARD`;
    case 'vevent':
      const formatTime = (time: string) => time.replace(/[-:]/g, '') + 'Z';
      return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${content.vevent.title}\nLOCATION:${content.vevent.location}\nDTSTART:${formatTime(content.vevent.startTime)}\nDTEND:${formatTime(content.vevent.endTime)}\nEND:VEVENT\nEND:VCALENDAR`;
    default:
      return '';
  }
};

export const generateQROptions = (state: AppState): Options => {
  const data = generateQRData(state.content);
  const { style, branding, advanced } = state;

  const options: Options = {
    width: advanced.resolution,
    height: advanced.resolution,
    data: data || 'https://example.com',
    margin: advanced.margin,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: advanced.errorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: branding.logoSize,
      margin: 5,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: style.gradientEnabled ? undefined : style.fgColor,
      gradient: style.gradientEnabled
        ? {
            type: style.gradientType,
            rotation: style.gradientRotation * (Math.PI / 180), // Convert degrees to radians
            colorStops: [
              { offset: 0, color: style.gradientStart },
              { offset: 1, color: style.gradientEnd },
            ],
          }
        : undefined,
      type: style.dotsType as any,
    },
    backgroundOptions: {
      color: style.bgColor,
    },
    cornersSquareOptions: {
      color: style.fgColor,
      type: style.cornersSquareType as any,
    },
    cornersDotOptions: {
      color: style.fgColor,
      type: style.cornersDotType as any,
    },
  };

  if ((branding.type === 'image' || branding.type === 'app') && branding.logoUrl) {
    options.image = branding.logoUrl;
  } else if (branding.type === 'icon' && branding.iconSlug) {
    options.image = `https://api.iconify.design/${branding.iconSlug.replace(':', '/')}.svg`;
  } else if (branding.type === 'text' && branding.textValue) {
    options.image = generateTextLogo(branding.textValue, style.bgColor, style.fgColor);
  }

  return options;
};

const generateTextLogo = (text: string, bgColor: string, fgColor: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 200, 200);

  ctx.fillStyle = fgColor;
  ctx.font = 'bold 100px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.substring(0, 10), 100, 100);

  return canvas.toDataURL('image/png');
};
