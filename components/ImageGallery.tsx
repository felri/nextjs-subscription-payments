'use client';

import { Database } from '@/types_db';
import { getStorageSupabaseUrl } from '@/utils/helpers';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type Props = {
  media: Database['public']['Tables']['media']['Row'][];
  userId: string;
};

const ImageGallery: React.FC<Props> = ({ media, userId }) => {
  const settings = {
    dots: true,
    arrows: true,
    vertical: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true // Allows dragging with touch or mouse
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow-md min-h-60">
      {media && media.length > 0 && (
        <div className="my-3">
          <Slider {...settings} lazyLoad="ondemand">
            {media.map(
              (
                m: Database['public']['Tables']['media']['Row'],
                index: number
              ) => (
                <div key={index} className="w-full h-60 min-h-60">
                  <img
                    src={getStorageSupabaseUrl(m.media_url || '', userId)}
                    alt="Media"
                    className="w-full object-cover rounded-md min-h-60"
                  />
                </div>
              )
            )}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
