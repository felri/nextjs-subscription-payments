'use client';

import { Database } from '@/types_db';
import { getStorageSupabaseUrl } from '@/utils/helpers';
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
  className = ' w-full'
}) => {
  const settings = {
    dots: false,
    arrows: true,
    vertical: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow-md">
      {media && media.length > 0 && (
        <Slider {...settings} lazyLoad="ondemand">
          {firstPhoto && (
            <div className={className}>
              <Image
                src={firstPhoto}
                alt="Media"
                width="0"
                height="0"
                sizes="100vw"
                className="rounded-md"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )}
          {media.map(
            (
              m: Database['public']['Tables']['media']['Row'],
              index: number
            ) => {
              if (m.media_type === 'image') {
                return (
                  <div key={index} className={className}>
                    <Image
                      src={getStorageSupabaseUrl(m.media_url || '', userId)}
                      alt="Media"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="rounded-md"
                      style={{ width: '100%', height: 'auto' }}
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
