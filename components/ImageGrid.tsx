import ConfirmationModal from '@/components/ConfirmationModal';
import LoadingDots from '@/components/ui/LoadingDots';
import React, { useRef, useState } from 'react';

interface ImageGridProps {
  images: string[];
  onDelete: (image: string) => void;
  loading?: boolean;
  setFeatured?: (image: string) => void;
  featuredImage?: string;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onDelete,
  loading,
  setFeatured,
  featuredImage
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const imageRef = useRef(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchEndX = event.changedTouches[0].clientX;
    const difference = touchStartX - touchEndX;

    // You can adjust this threshold (50 in this case) if needed
    if (difference > 50) {
      moveRight();
    } else if (difference < -50) {
      moveLeft();
    }
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleDelete = () => {
    setConfirmationModal(true);
  };

  const handleSetFeatured = () => {
    setFeatured?.(selectedImage ?? '');
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  const onConfirm = () => {
    setConfirmationModal(false);
    onDelete(selectedImage?.split('/').pop() ?? '');
    closeModal();
  };

  const moveLeft = () => {
    const index = images.indexOf(selectedImage ?? '');
    if (index === 0) {
      setSelectedImage(images[images.length - 1]);
    } else {
      setSelectedImage(images[index - 1]);
    }
  };

  const moveRight = () => {
    const index = images.indexOf(selectedImage ?? '');
    if (index === images.length - 1) {
      setSelectedImage(images[0]);
    } else {
      setSelectedImage(images[index + 1]);
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, idx) => (
          <div
            key={idx}
            className={`relative w-full h-32 md:h-48 lg:h-64 rounded-md overflow-hidden cursor-pointer ${
              featuredImage === image ? 'border-4 border-green-400' : ''
            }`}
            onClick={() => openModal(image)}
          >
            <img
              src={image}
              alt={`Gallery Image ${idx + 1}`}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
          ref={imageRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Overlay */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div className="bg-black p-4 max-w-xl w-full rounded-md shadow-lg relative z-20 flex flex-col relative">
            {/* left arrow */}
            <button
              className="absolute top-0 bottom-0 left-2 focus:outline-none rounded-full p-2 h-full w-10 flex justify-center items-center"
              onClick={moveLeft}
            >
              <span className="text-4xl text-white">&lt;</span>
            </button>

            {/* Image */}

            <img
              src={selectedImage || ''}
              alt="Selected"
              className="w-full h-full object-contain mb-4 max-h-[80vh]"
            />

            {/* right arrow */}
            <button
              className="absolute top-0 bottom-0 right-2 focus:outline-none rounded-full p-2 h-full w-10 flex justify-center items-center"
              onClick={moveRight}
            >
              <span className="text-4xl text-white">&gt;</span>
            </button>

            <div className="mt-4 flex justify-between">
              {/* Deletar button */}
              <button
                disabled={loading}
                onClick={handleDelete}
                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Deletar
              </button>
              {selectedImage !== featuredImage && (
                <button
                  disabled={loading || featuredImage === selectedImage}
                  onClick={handleSetFeatured}
                  className="bg-blue-900 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  {loading ? <LoadingDots /> : 'Definir como principal'}
                </button>
              )}

              {/* Fechar button */}
            </div>

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none bg-red-400 rounded-full p-2 w-10 h-10 flex justify-center items-center"
              onClick={closeModal}
            >
              <span className="text-2xl text-white">&times;</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {!loading && confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal}
          onConfirm={onConfirm}
          onCancel={() => setConfirmationModal(false)}
        />
      )}
    </div>
  );
};

export default ImageGrid;
