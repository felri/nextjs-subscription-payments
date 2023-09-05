'use client';

import TagsSelector from '@/components/TagsSelector';
import { Debit, Credit, Cash, Pix } from '@/components/icons/Payments';
import { Database } from '@/types_db';
import {
  formatCurrencyToBrl,
  getStorageSupabaseUrl,
  capitalizeFirstLetterAllWords,
  getEthinicity,
  getSexualOrientation,
  openWhatsapp
} from '@/utils/helpers';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { IoLogoWhatsapp } from 'react-icons/io5';

interface SellerProps {
  seller?: Database['public']['Tables']['sellers']['Row'];
  media?: Database['public']['Tables']['media']['Row'][];
  tags?: Database['public']['Tables']['seller_services_tags']['Row'][];
}

const Seller: React.FC<SellerProps> = ({ seller, media, tags }) => {
  const filteredTags = tags?.filter((tag) =>
    seller?.service_tags?.includes(tag.slug || '')
  );

  return (
    <div className="w-full p-4 pt-0">
      <div className="flex justify-center items-center w-full mb-6 relative">
        <AvatarPicture
          image={
            seller?.featured_image_url || media?.[0]?.media_url || undefined
          }
        />
        <div
          className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2 cursor-pointer hover:bg-green-500 active:bg-green-700"
          onClick={() => openWhatsapp(seller?.name || '', seller?.phone || '')}
        >
          <IoLogoWhatsapp className="text-white text-4xl" />
        </div>
      </div>
      <div className="bg-zinc-800 rounded-lg shadow-md cursor-pointer">
        <div className="p-2">
          <h2 className="text-white text-xl font-semibold mb-1">
            {capitalizeFirstLetterAllWords(seller?.name || '')}
          </h2>
          <div className="text-white text-sm mb-2">
            {seller?.short_description}
          </div>
          <div className="flex justify-center items-center flex-col">
            <div className="w-full flex">
              <div className="w-1/2">
                <div className="text-sm text-green-300 font-semibold">
                  {formatCurrencyToBrl(seller?.hourly_rate || 0)}/h
                </div>
                <div className="text-sm">{seller?.age} anos</div>
                <div className="text-sm">{seller?.current_height} cm</div>
                <div className="text-sm">{seller?.current_weight} kg</div>
                <div className="text-sm">Pés {seller?.shoe_size} </div>
              </div>
              <div className="w-1/2">
                {seller?.has_piercings && (
                  <div className="text-sm">
                    <AiOutlineCheckCircle className="inline-block text-pink-600" />{' '}
                    Piercings
                  </div>
                )}
                {seller?.has_tattoos && (
                  <div className="text-sm">
                    <AiOutlineCheckCircle className="inline-block text-pink-600" />{' '}
                    Tatuagens
                  </div>
                )}
                {seller?.has_silicone && (
                  <div className="text-sm">
                    <AiOutlineCheckCircle className="inline-block text-pink-600" />{' '}
                    Silicone
                  </div>
                )}
                {/* etnia */}
                <div className="text-sm">
                  Etnia {getEthinicity(seller?.ethnicity)}
                </div>
                <div className="text-sm">
                  {getSexualOrientation(seller?.sexual_orientation)}
                </div>
              </div>
            </div>
            {/* payment methods */}
            <div className="text-sm font-semibold mb-2">
              {seller?.neighborhood} - {seller?.cities?.name}
            </div>
            <AcceptedPayments paymentMethods={seller?.payment_methods || []} />
            <div className="w-full text-ellipsis overflow-hidden mt-4">
              <div className="text-sm wrap">
                {seller?.description?.split('\n').map((para, index) => {
                  if (para) {
                    // This checks if the paragraph isn't an empty string
                    return <div key={index}>{para}</div>;
                  }
                  return null; // Returning null for empty strings
                })}
              </div>
            </div>
          </div>
        </div>
        <TagsSelector
          tags={filteredTags || []}
          selectedTags={seller?.service_tags || []}
          toggleTag={() => {}}
        />
        {media && media.length > 0 && (
          <ImageList media={media} userId={seller?.user_id || ''} />
        )}
      </div>
    </div>
  );
};

const VideoPlayer = ({
  mediaUrl,
  userId
}: {
  mediaUrl: string;
  userId: string;
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = React.useState(true);

  const onPosterClick = () => {
    console.log('clicked');
    if (videoRef.current) {
      videoRef.current.play();
      setShowPoster(false);
    }
  };

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden cursor-pointer min-h-[360px]">
      <video
        muted
        ref={videoRef}
        preload="none"
        width="100%"
        height="auto"
        className="rounded-md"
        controls
        src={getStorageSupabaseUrl(mediaUrl, userId)}
      >
        Your browser does not support the video tag.
      </video>

      {showPoster && (
        <Image
          className="absolute top-0 left-0 rounded-md"
          src="/blur-video.png"
          alt="Media"
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: '100%', height: '100%' }}
          onClick={onPosterClick}
        />
      )}
    </div>
  );
};

const ImageList = ({
  media,
  userId
}: {
  media: Database['public']['Tables']['media']['Row'][];
  userId: string;
}) => {
  return (
    <div className="flex flex-col h-full">
      {media.map((item) => (
        <div key={item.media_id} className="w-full p-2 relative h-full">
          <div className="bg-zinc-800 rounded-lg shadow-md">
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
                src={getStorageSupabaseUrl(item.media_url || '', userId)}
                alt="Media"
                width="0"
                height="0"
                sizes="100vw"
                className="rounded-md"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const AvatarPicture: React.FC<{ image?: string }> = ({ image }) => {
  return (
    <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-pink-900">
      <img
        src={image || '/images/avatar.png'}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const AcceptedPayments: React.FC<{ paymentMethods: string[] }> = ({
  paymentMethods
}) => {
  return (
    <div className="flex flex-row justify-center items-center space-x-2 mx-2 w-full">
      {paymentMethods.map((method) => {
        switch (method) {
          case 'cash':
            return (
              <div
                className="text-sm flex items-center justify-center"
                key={method}
              >
                <Cash className="inline-block" /> Dinheiro
              </div>
            );
          case 'debit':
            return (
              <div
                className="text-sm items-center justify-center flex"
                key={method}
              >
                <Debit className="inline-block mr-2" /> Débito
              </div>
            );
          case 'credit':
            return (
              <div
                className="text-sm items-center justify-center flex"
                key={method}
              >
                <Credit className="inline-block mr-2" /> Crédito
              </div>
            );
          case 'pix':
            return (
              <div
                className="text-sm items-center justify-center flex"
                key={method}
              >
                <Pix className="inline-block mr-2" /> Pix
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default Seller;
