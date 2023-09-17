'use client';

import Gallery from '@/components/ImageGallery';
import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import {
  capitalizeFirstLetterAllWords,
  formatCurrencyToBrl,
  formatPhonenumberBR
} from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AiOutlinePhone } from 'react-icons/ai';
import { IoLogoWhatsapp } from 'react-icons/io5';
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
    <div className="relative bg-black rounded-md cursor-pointer transition duration-300 border border-zinc-600 max-w-sm w-full box-border m-1">
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
          <div className="rounded-full p-1 cursor-pointer z-10 absolute bottom-2 right-2 bg-white">
            <MdVerified className="text-green-600 text-5xl" />
          </div>
        )}
      </div>

      <div className="" onClick={onClick}>
        <h2 className="text-white text-xl font-semibold flex items-center p-2 bg-zinc-700">
          {capitalizeFirstLetterAllWords(seller?.name || '')}
          {seller?.verification_status === 'verified' && (
            <>
              <div className="rounded-full mx-2 cursor-pointer z-10">
                <MdVerified className="text-green-600 text-2xl shadow" />
              </div>
              <div className="text-xs text-gray-300 ">Perfil verificado</div>
            </>
          )}
        </h2>
        <p className="text-white text-sm p-2 bg-zinc-800 shadow truncate">
          {seller?.short_description}
        </p>
        <div className="flex text-ellipsis justify-center items-end p-2">
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
        <div className="flex justify-between px-4 pb-2 items-center mt-2 ">
          <p className="text-gray-300 mr-2 font-bold text-lg w-full text-center">{formatPhonenumberBR(seller?.phone || '')}</p>
          <button
            className=" bg-green-500 p-2 rounded-md text-white font-semibold"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShowPhone?.(seller);
            }}
          >
            {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
            <IoLogoWhatsapp className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
