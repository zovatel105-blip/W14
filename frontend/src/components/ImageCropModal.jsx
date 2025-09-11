/**
 * ImageCropModal - Modal component for cropping images with react-image-crop
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import { X, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropModal = ({
  isOpen = false,
  onClose = () => {},
  onSave = () => {},
  imageFile = null,
  aspectRatio = null, // null for free aspect, 1 for square, 16/9 for wide, etc.
  cropShape = 'rect', // 'rect' or 'round'
  title = 'Recortar Imagen',
  minWidth = 150,
  minHeight = 150
}) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [imageSrc, setImageSrc] = useState('');
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Load and display the image
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  // Initialize crop when image loads
  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    
    let initialCrop;
    if (aspectRatio) {
      initialCrop = centerCrop(
        makeAspectCrop({ unit: '%', width: 80 }, aspectRatio, width, height),
        width,
        height
      );
    } else {
      // Free aspect crop - start with 80% of image
      initialCrop = {
        unit: '%',
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      };
    }
    
    setCrop(initialCrop);
  }, [aspectRatio]);

  // Generate cropped image
  const getCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return null;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    // Convert crop to pixel coordinates
    const pixelCrop = convertToPixelCrop(
      completedCrop,
      image.naturalWidth,
      image.naturalHeight
    );

    // Set canvas size to match crop
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Apply transformations
    ctx.save();
    
    // Handle rotation
    if (rotate !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Draw the cropped image
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

    ctx.restore();

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          blob.name = imageFile?.name || 'cropped-image.jpg';
          resolve(blob);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.95);
    });
  }, [completedCrop, rotate, imageFile]);

  // Handle save
  const handleSave = async () => {
    const croppedBlob = await getCroppedImage();
    if (croppedBlob) {
      // Convert blob to File
      const croppedFile = new File([croppedBlob], imageFile?.name || 'cropped-image.jpg', {
        type: 'image/jpeg'
      });
      
      // Also generate base64 for preview
      const reader = new FileReader();
      reader.onload = () => {
        onSave({
          file: croppedFile,
          blob: croppedBlob,
          base64: reader.result,
          originalFile: imageFile
        });
        onClose();
      };
      reader.readAsDataURL(croppedBlob);
    }
  };

  // Handle close
  const handleClose = () => {
    setImageSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    setRotate(0);
    onClose();
  };

  // Reset transformations
  const handleReset = () => {
    setScale(1);
    setRotate(0);
    if (imgRef.current) {
      onImageLoad({ currentTarget: imgRef.current });
    }
  };

  if (!isOpen || !imageFile) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Crop Area */}
          <div className="p-4 max-h-[60vh] overflow-auto">
            {imageSrc && (
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  minWidth={minWidth}
                  minHeight={minHeight}
                  circularCrop={cropShape === 'round'}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    alt="Crop preview"
                    src={imageSrc}
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      maxWidth: '100%',
                      maxHeight: '500px',
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col gap-4">
              {/* Scale and Rotate Controls */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4" />
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-20"
                  />
                  <ZoomIn className="w-4 h-4" />
                  <span className="w-12 text-center">{Math.round(scale * 100)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    value={rotate}
                    onChange={(e) => setRotate(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="w-12 text-center">{rotate}°</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restablecer
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!completedCrop}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hidden canvas for generating cropped image */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageCropModal;