import { Database } from '@/types_db';
import React from 'react';

interface CardProps {
  seller?: Database['public']['Tables']['sellers']['Row'];
  media?: Database['public']['Tables']['media']['Row'][]
}

const Card: React.FC<CardProps> = ({ seller, media }) => {
  console.log('seller', seller);
  return (
    <div className="w-full sm:w-1/3 p-2">
      <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
        <h2 className="text-white text-xl font-semibold mb-2">{seller?.name}</h2>

        {media && media.length > 0 && (
          <div className="mt-2">
            <img
              src={media[0].media_url || ''}
              alt="Media"
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
        )}

        <div className="mt-4 text-zinc-200">
          {/* Add more seller details here as needed */}
          <p className="text-sm">User ID: {seller?.user_id}</p>
          <p className="text-sm">City ID: {seller?.city_id}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
