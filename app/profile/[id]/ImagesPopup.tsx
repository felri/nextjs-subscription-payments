import VideoPlayer from './VideoPlayer';
import { Database } from '@/types_db';
import { getStorageSupabaseUrl, getStorageSupabaseUrlThumbnail } from '@/utils/helpers';
import Image from 'next/image';
import Slider from 'react-slick';
import { AiFillCloseCircle } from 'react-icons/ai';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="absolute top-0 right-0 cursor-pointer text-2xl text-white p-2 z-20"
      onClick={onClick}
    >
      <AiFillCloseCircle className='text-red-800 text-4xl' />
    </div>
  );
}


function ImagesPopup({
  media,
  userId,
  selectedIndex,
  onClose
}: {
  media: Database['public']['Tables']['media']['Row'][];
  userId: string;
  selectedIndex: number;
  onClose: () => void;
}) {
  const settings = {
    dots: true,
    arrows: true,
    vertical: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    infinite: true,
    autoplay: false
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-black p-4 w-full h-full overflow-y-auto rounded-md shadow-lg relative z-20 flex flex-col mx-auto flex items-center justify-center">
        <div className="w-full mx-auto">
          <CloseButton onClick={onClose} />
          <Slider {...settings} initialSlide={selectedIndex} className="items-center jusitify-center">
            {media.map((item, index) => (
              <div
                className="bg-zinc-800 rounded shadow-md overflow-hidden"
                key={index}
              >
                {item.media_type === 'video' ? (
                  // Render Video Player
                  <VideoPlayer
                    mediaUrl={item.media_url || ''}
                    userId={userId}
                    key={item.media_id}
                  />
                ) : (
                  // Render Image
                  <Image
                    src={getStorageSupabaseUrl(
                      item.media_url || '',
                      userId
                    )}
                    alt="Media"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className=""
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
                {/* <DateLabel createdAt={item.created_at} /> */}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default ImagesPopup;
