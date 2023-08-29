import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const imageObjects = images.map((url) => ({
    original: url,
    thumbnail: url 
  }));

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <ImageGallery
        items={imageObjects}
        showPlayButton={false}
        showFullscreenButton={false}
      />
    </div>
  );
};

export default Gallery;
