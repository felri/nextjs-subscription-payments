'use client';

import Gallery from '@/components/ImageGallery';
import { Database } from '@/types_db';
import { formatCurrencyToBrl } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoLogoWhatsapp } from 'react-icons/io5';

interface SellerProps {
  seller?: Database['public']['Tables']['sellers']['Row'];
  media?: Database['public']['Tables']['media']['Row'][];
}

const Seller: React.FC<SellerProps> = ({ seller, media }) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/profile/${seller?.user_id}`);
  };

  return (
    <div className="w-full p-2">
      <div className="flex justify-center items-center w-full mb-6 relative">
        <AvatarPicture
          image={
            seller?.featured_image_url || media?.[0]?.media_url || undefined
          }
        />
        <div className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2">
          <a
            href={`https://api.whatsapp.com/send?phone=55${seller?.phone}`}
            target="_blank"
            rel="noreferrer"
          >
            <IoLogoWhatsapp className="text-white text-2xl" />
          </a>
        </div>
      </div>
      <div className="bg-zinc-800 rounded-lg shadow-md cursor-pointer transition duration-300 hover:bg-zinc-700 active:bg-zinc-600">
        <div className="p-2" onClick={onClick}>
          <h2 className="text-white text-xl font-semibold mb-1">
            {seller?.name}
          </h2>
          <p className="text-white text-sm mb-2">{seller?.short_description}</p>
          <div className="flex justify-center items-center flex-col">
            <div className="w-full">
              <p className="text-sm text-green-300 font-semibold">
                {formatCurrencyToBrl(seller?.hourly_rate || 0)}/h
              </p>
              <p className="text-sm">{seller?.age} anos</p>
              <p className="text-sm">{seller?.current_height} cm</p>
              <p className="text-sm">{seller?.current_weight} kg</p>
              <p className="text-sm font-semibold">
                {seller?.neighborhood} - {seller?.cities?.name}
              </p>
            </div>
            <div className="w-full max-h-[120px] text-ellipsis overflow-hidden mt-4">
              <p className="text-sm wrap">{seller?.description}</p>
            </div>
          </div>
        </div>
        <div className="min-h-[260px]">
          {media && media.length > 0 && (
            <Gallery
              media={media}
              userId={seller?.user_id || ''}
              onClick={onClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const AvatarPicture: React.FC<{ image?: string }> = ({ image }) => {
  return (
    <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-zinc-600">
      <img
        src={image || '/images/avatar.png'}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Seller;