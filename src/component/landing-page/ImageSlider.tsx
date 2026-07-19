interface ImageSliderProps {
  images: string[];
  currentImageIndex: number;
  fallbackImages: string[];
}

const ImageSlider = ({ images, currentImageIndex, fallbackImages }: ImageSliderProps) => {
  return (
    <div className="absolute inset-0">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${image}')`,
          }}
          onError={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.backgroundImage = `url('${fallbackImages[index % fallbackImages.length]}')`;
          }}
        />
      ))}
    </div>
  );
};

export default ImageSlider;
