'use client';

import { Database } from '@/types_db';
import { getStorageSupabaseUrlThumbnail } from '@/utils/helpers';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

type Props = {
  media: Database['public']['Tables']['media']['Row'][];
  userId: string;
  firstPhoto?: string;
  onClick: () => void;
  className?: string;
};

const ImageGallery: React.FC<Props> = ({
  media,
  userId,
  firstPhoto,
  onClick,
  className = 'w-full h-80 rounded-lg shadow-md overflow-hidden'
}) => {
  const settings = {
    dots: false,
    arrows: true,
    vertical: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true
  };

  const firstPhotoIndex = media.findIndex(
    (m) => m.media_url === firstPhoto && m.media_type === 'image'
  );

  if (firstPhotoIndex > 0) {
    media.unshift(media.splice(firstPhotoIndex, 1)[0]);
  }

  const getUrl = (url: string) => {
    return getStorageSupabaseUrlThumbnail(url, userId);
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow-md" onClick={onClick}>
      {media && media.length > 0 && (
        <Slider {...settings} lazyLoad="progressive" className="h-80">
          {media.map(
            (
              m: Database['public']['Tables']['media']['Row'],
              index: number
            ) => {
              if (m.media_type === 'image') {
                return (
                  <div key={index} className={className}>
                    <Image
                      src={getUrl(m.media_url || '')}
                      alt="Media"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                );
              }
            }
          )}
        </Slider>
      )}
    </div>
  );
};

export default ImageGallery;
