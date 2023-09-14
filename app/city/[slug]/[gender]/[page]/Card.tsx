'use client';

import Gallery from '@/components/ImageGallery';
import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import {
  capitalizeFirstLetterAllWords,
  formatCurrencyToBrl
} from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdVerified } from 'react-icons/md';

interface CardProps {
  seller?: Database['public']['Tables']['sellers']['Row'];
  media?: Database['public']['Tables']['media']['Row'][];
  onShowPhone?: (
    seller: Database['public']['Tables']['sellers']['Row'] | undefined
  ) => void;
}

const Card: React.FC<CardProps> = ({ seller, media, onShowPhone }) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/profile/${seller?.user_id}`);
  };

  return (
    <div className="w-full sm:w-1/3 p-2">
      <div className="bg-zinc-800 rounded-lg shadow-md cursor-pointer transition duration-300 hover:bg-zinc-900 active:bg-zinc-900">
        <div className="relative">
          {media && media.length > 0 && (
            <Gallery
              media={media}
              userId={seller?.user_id || ''}
              firstPhoto={seller?.featured_image_url || undefined}
              onClick={onClick}
            />
          )}
          {seller?.verification_status === 'verified' && (
            <>
              <div className="rounded-full p-2 cursor-pointer z-10 absolute bottom-1 left-0 bg-white">
                <MdVerified className="text-green-600 text-5xl" />
              </div>
            </>
          )}
        </div>

        <div className="p-2" onClick={onClick}>
          <h2 className="text-white text-xl font-semibold mb-1 flex items-center">
            {capitalizeFirstLetterAllWords(seller?.name || '')}
            {seller?.verification_status === 'verified' && (
              <>
                <div className="rounded-full p-2 cursor-pointer z-10">
                  <MdVerified className="text-green-600 text-2xl" />
                </div>
                <div className="text-xs text-gray-300 ">Perfil verificado</div>
              </>
            )}
          </h2>
          <p className="text-white text-sm mb-2">{seller?.short_description}</p>
          <div className="flex text-ellipsis justify-center items-end">
            <div className="w-1/2">
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
            <div className="w-1/2 max-h-[120px] text-ellipsis overflow-hidden">
              <p className="text-sm wrap">{seller?.description}</p>
            </div>
          </div>
          <div className="flex justify-center items-center mt-2">
            <button
              className="w-full bg-[#960044] p-2 mt-2 rounded-md text-white font-semibold"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShowPhone?.(seller);
              }}
            >
              {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
              Ver telefone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
