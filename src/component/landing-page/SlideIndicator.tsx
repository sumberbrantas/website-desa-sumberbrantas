import { useEffect, useState } from "react";

interface SlideIndicatorProps {
  images: string[];
  currentImageIndex: number;
  onSlideChange: (index: number) => void;
}

const SlideIndicator = ({ images, currentImageIndex, onSlideChange }: SlideIndicatorProps) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/70"}`}
            onClick={() => onSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideIndicator;
