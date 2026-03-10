import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

interface ImageCropModalProps {
  imageUrl: string;
  onComplete: (croppedUrl: string) => void;
  onCancel: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageUrl, onComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return '';
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        if (file) {
          resolve(URL.createObjectURL(file));
        }
      }, 'image/png');
    });
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      onComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Crop Logo</h3>
            <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full h-80 bg-slate-900">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Apply Crop</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
