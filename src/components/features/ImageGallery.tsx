import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Navigation functions
  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, currentIndex]);

  // Preload adjacent images
  useEffect(() => {
    if (showLightbox) {
      const preloadImage = (index: number) => {
        if (index >= 0 && index < images.length) {
          const img = new Image();
          img.src = images[index];
        }
      };

      // Preload next and previous images
      preloadImage(currentIndex + 1);
      preloadImage(currentIndex - 1);
    }
  }, [currentIndex, showLightbox, images]);

  return (
    <div className="space-y-4">
      {title && <h3 className="text-xl font-bold text-gray-800">{title}</h3>}
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div 
            key={index}
            onClick={() => openLightbox(index)}
            className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <img 
              src={image} 
              alt={`Gallery image ${index + 1}`} 
              className="w-full h-48 object-cover object-center group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
              <span className="text-white text-sm font-medium px-3 py-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Image
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Lightbox */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div 
            className="relative w-full h-full flex items-center justify-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <img 
              src={images[currentIndex]} 
              alt={`Gallery image ${currentIndex + 1}`} 
              className="max-h-[80vh] max-w-[80vw] object-contain"
            />
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={currentIndex === index}
                ></button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;