import Gallery from '@/components/ImageGallery';
import { Database } from '@/types_db';
import { formatCurrencyToBrl } from '@/utils/helpers';
import React from 'react';

interface CardProps {
  seller?: Database['public']['Tables']['sellers']['Row'];
  media?: Database['public']['Tables']['media']['Row'][];
}

const Card: React.FC<CardProps> = ({ seller, media }) => {
  return (
    <div className="w-full sm:w-1/3 p-2">
      <div className="bg-zinc-800 rounded-lg shadow-md">
        {media && media.length > 0 && (
          <Gallery media={media} userId={seller?.user_id || ''} />
        )}
        <div className="p-2">
          <h2 className="text-white text-xl font-semibold mb-1">
            {seller?.name}
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
        </div>
      </div>
    </div>
  );
};

export default Card;
