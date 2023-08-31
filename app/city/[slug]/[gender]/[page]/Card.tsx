import { Database } from '@/types_db';
import { formatCurrencyToBrl } from '@/utils/helpers';
import React from 'react';

interface CardProps {
  seller?: Database['public']['Tables']['sellers']['Row'];
  media?: Database['public']['Tables']['media']['Row'][];
}

// seller_id: string;
// user_id: string;
// name: string | null;
// description: string | null;
// short_description: string | null;
// phone: string | null;
// city_id: string | null;
// state_id: string | null;
// neighborhood: string | null;
// avatar_url: string | null;
// feature_image: string | null;
// gender: string | null;
// hourly_rate?: number | null;
// age?: number | null;
// location_description?: string | null;
// sexual_orientation?: string | null;
// current_weight?: number | null;
// current_height?: number | null;
// ethnicity?: string | null;
// hair_color?: string | null;
// hair_length?: string | null;
// shoe_size?: number | null;
// has_silicone?: boolean | null;
// has_tattoos?: boolean | null;
// has_piercings?: boolean | null;
// payment_methods?: string[] | null;
// service_location?: string | null;
// address_details?: string | null;
// media?: {
//   media: Database['public']['Tables']['media']['Row'][] | null;
// };
// cities?: {
//   city_id: string;
//   name?: string | null;
// }

const Card: React.FC<CardProps> = ({ seller, media }) => {
  console.log('seller', seller);
  return (
    <div className="w-full sm:w-1/3 p-2">
      <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
        {media && media.length > 0 && (
          <div className="mt-2">
            <img
              src={media[0].media_url || ''}
              alt="Media"
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
        )}
        <h2 className="text-white text-xl font-semibold mb-1">
          {seller?.name}
        </h2>
        <p className="text-white text-sm mb-2">{seller?.short_description}</p>
        <div className="flex text-ellipsis justify-center items-end">
          <div className="w-1/2">
            <p className="text-sm text-green-300 font-semibold">
              {formatCurrencyToBrl(seller?.hourly_rate || 0)}
            </p>
            <p className="text-sm">{seller?.age} anos</p>
            <p className="text-sm font-semibold">
              {seller?.neighborhood} - {seller?.cities?.name}
            </p>
          </div>
          <div className="w-1/2 max-h-[120px] text-ellipsis overflow-hidden">
            <p className="text-sm wrap">
              {seller?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
