import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import gallery images
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';

const galleryImages = [
  { src: gallery1, alt: 'Futuristic Cityscape', title: 'Cyberpunk City' },
  { src: gallery2, alt: 'Digital Network', title: 'Network Visualization' },
  { src: gallery3, alt: 'Tech Laboratory', title: 'Future Lab' },
  { src: gallery4, alt: 'Matrix Code', title: 'Digital Matrix' },
  { src: gallery5, alt: 'Space Station', title: 'Space Technology' },
  { src: gallery6, alt: 'Abstract Patterns', title: 'Digital Art' },
];

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate images
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  return (
    <section id="gallery" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 neon-text animate-slide-in">
          Digital Gallery
        </h2>

        {/* Main Gallery Display */}
        <div className="relative mb-8">
          <div className="glass-card rounded-2xl overflow-hidden neon-glow">
            <div className="relative aspect-video">
              <img
                key={currentIndex}
                src={galleryImages[currentIndex].src}
                alt={galleryImages[currentIndex].alt}
                className="w-full h-full object-cover animate-fade-in"
              />
              
              {/* Overlay with title */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {galleryImages[currentIndex].title}
                </h3>
                <p className="text-muted-foreground">
                  {galleryImages[currentIndex].alt}
                </p>
              </div>

              {/* Navigation Arrows */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 btn-glass"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 btn-glass"
                onClick={goToNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {galleryImages.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`w-3 h-3 rounded-full p-0 transition-all ${
                  index === currentIndex 
                    ? 'bg-primary animate-pulse-glow' 
                    : 'bg-muted hover:bg-muted-foreground'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`gallery-item glass-card rounded-lg overflow-hidden cursor-pointer ${
                index === currentIndex ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => goToSlide(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full aspect-video object-cover"
              />
            </div>
          ))}
        </div>

        {/* Auto-play Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
            <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;