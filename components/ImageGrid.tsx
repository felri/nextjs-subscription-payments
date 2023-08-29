import ConfirmationModal from '@/components/ConfirmationModal';
import React, { useState } from 'react';
import LoadingDots from '@/components/ui/LoadingDots';

interface ImageGridProps {
  images: string[];
  onDelete: (image: string) => void;
  loading?: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onDelete, loading }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleDelete = () => {
    setConfirmationModal(true);
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

  return (
    <div className="">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-md cursor-pointer"
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
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div className="bg-white p-4 max-w-xl w-full rounded-md shadow-lg relative z-20 flex flex-col">
            <img
              src={selectedImage || ''}
              alt="Selected"
              className="w-full h-full object-contain mb-4"
            />

            <div className="mt-4 flex justify-between">
              {/* Deletar button */}
              <button
                disabled={loading}
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Deletar
              </button>

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
