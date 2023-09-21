import ConfirmationModal from '@/components/ConfirmationModal';
import LoadingDots from '@/components/ui/LoadingDots';
import { Database } from '@/types_db';
import {
  getStorageSupabaseUrl,
  getStorageSupabaseUrlThumbnail
} from '@/utils/helpers';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill
} from 'react-icons/bs';

interface ImageGridProps {
  userId: string;
  images: Database['public']['Tables']['media']['Row'][];
  onDelete: (image: string) => void;
  loading?: boolean;
  setFeatured?: (image: string) => void;
  featuredImageUrl?: string;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  userId,
  images,
  onDelete,
  loading,
  setFeatured,
  featuredImageUrl
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const featuredImageId = images.find(
    (image) => image.media_url === featuredImageUrl
  )?.media_id;

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

  const openModal = (media_id: string) => {
    setSelectedMediaId(media_id);
    setModalOpen(true);
  };

  const handleDelete = () => {
    setConfirmationModal(true);
  };

  const handleSetFeatured = () => {
    setFeatured?.(selectedMediaId ?? '');
  };

  const closeModal = () => {
    setSelectedMediaId(null);
    setModalOpen(false);
  };

  const onConfirm = () => {
    setConfirmationModal(false);
    onDelete(selectedMediaId ?? '');
    closeModal();
  };

  const moveLeft = () => {
    const index = images.findIndex(
      (image) => image.media_id === selectedMediaId
    );
    if (index === 0) {
      setSelectedMediaId(images[images.length - 1].media_id);
    } else {
      setSelectedMediaId(images[index - 1].media_id);
    }
  };

  const moveRight = () => {
    const index = images.findIndex(
      (image) => image.media_id === selectedMediaId
    );
    if (index === images.length - 1) {
      setSelectedMediaId(images[0].media_id);
    } else {
      setSelectedMediaId(images[index + 1].media_id);
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, idx) => {
          return (
            <div
              key={image.media_id}
              className={`relative w-full h-32 md:h-48 lg:h-64 rounded-md overflow-hidden cursor-pointer ${
                featuredImageUrl === image.media_url
                  ? 'border-4 border-green-400'
                  : ''
              }`}
              onClick={() => openModal(image.media_id)}
            >
              <Image
                src={
                  getStorageSupabaseUrlThumbnail(
                    image.media_url || '',
                    userId
                  ) || ''
                }
                alt={image.description || `Gallery Image ${idx + 1}`}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          );
        })}
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
              <BsFillArrowLeftCircleFill className="text-4xl" />
            </button>

            {/* Image */}

            {selectedMediaId && (
              <div>
                {images.find((img) => img.media_id === selectedMediaId)
                  ?.media_type === 'video' ? (
                  <video
                    controls
                    className="w-full h-full object-contain mb-4 max-h-[80vh]"
                  >
                    <source
                      src={
                        getStorageSupabaseUrl(
                          images.find((img) => img.media_id === selectedMediaId)
                            ?.media_url || '',
                          userId
                        ) || ''
                      }
                      type="video/mp4" // adjust the type based on your video format
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={
                      getStorageSupabaseUrl(
                        images.find((img) => img.media_id === selectedMediaId)
                          ?.media_url || '',
                        userId
                      ) || ''
                    }
                    alt="Selected"
                    className="w-full h-full object-contain mb-4 max-h-[80vh]"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </div>
            )}

            {/* right arrow */}
            <button
              className="absolute top-0 bottom-0 right-2 focus:outline-none rounded-full p-2 h-full w-10 flex justify-center items-center"
              onClick={moveRight}
            >
              <BsFillArrowRightCircleFill className="text-4xl" />
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
              {selectedMediaId !== featuredImageId && (
                <button
                  disabled={loading || featuredImageId === selectedMediaId}
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
