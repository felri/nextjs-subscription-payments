'use client';

import Gallery from '@/components/ImageGallery';
import { Debit, Credit, Cash, Pix } from '@/components/icons/Payments';
import { Database } from '@/types_db';
import { formatCurrencyToBrl, getStorageSupabaseUrl } from '@/utils/helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { IoLogoWhatsapp } from 'react-icons/io5';

interface SellerProps {
  seller?: Database['public']['Tables']['sellers']['Row'];
  media?: Database['public']['Tables']['media']['Row'][];
}

const Seller: React.FC<SellerProps> = ({ seller, media }) => {
  const router = useRouter();

  const onClick = () => {
    // router.push(`/profile/${seller?.user_id}`);
  };

  return (
    <div className="w-full p-4">
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
            <div className="w-full flex">
              <div className="w-1/2">
                <p className="text-sm text-green-300 font-semibold">
                  {formatCurrencyToBrl(seller?.hourly_rate || 0)}/h
                </p>
                <p className="text-sm">{seller?.age} anos</p>
                <p className="text-sm">{seller?.current_height} cm</p>
                <p className="text-sm">{seller?.current_weight} kg</p>
                <p className="text-sm">Pés {seller?.shoe_size} </p>
              </div>
              <div className="w-1/2">
                {seller?.has_piercings && (
                  <p className="text-sm">
                    <AiOutlineCheckCircle className="inline-block text-pink-600" />{' '}
                    Piercings
                  </p>
                )}
                {seller?.has_tattoos && (
                  <p className="text-sm">
                    <AiOutlineCheckCircle className="inline-block text-pink-600" />{' '}
                    Tatuagens
                  </p>
                )}
                {seller?.has_silicone && (
                  <p className="text-sm">
                    <AiOutlineCheckCircle className="inline-block text-pink-600" />{' '}
                    Silicone
                  </p>
                )}
              </div>
            </div>
            {/* payment methods */}
            <p className="text-sm font-semibold mb-2">
              {seller?.neighborhood} - {seller?.cities?.name}
            </p>
            <AcceptedPayments paymentMethods={seller?.payment_methods || []} />
            <div className="w-full max-h-[120px] text-ellipsis overflow-hidden mt-4">
              <p className="text-sm wrap">{seller?.description}</p>
            </div>
          </div>
        </div>
        <div className="min-h-[260px]">
          {media && media.length > 0 && (
            // <Gallery
            //   media={media}
            //   userId={seller?.user_id || ''}
            //   onClick={onClick}
            // />
            <ImageList
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

const ImageList = ({
  media,
  userId,
  onClick
}: {
  media: Database['public']['Tables']['media']['Row'][];
  userId: string;
  onClick: () => void;
}) => {
  return (
    <div className="flex flex-col h-full">
      {media.map((item) => (
        <div
          key={item.media_id}
          className="w-full p-2 relative h-full"
          onClick={() => console.log('clicked')}
        >
          <div className="bg-zinc-800 rounded-lg shadow-md">
            <Image
              src={getStorageSupabaseUrl(item.media_url || '', userId)}
              alt="Media"
              width="0"
              height="0"
              sizes="100vw"
              className="rounded-md"
              style={{ width: '100%', height: 'auto' }}
            />
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
              <p className="text-sm flex items-center justify-center">
                <Cash className="inline-block" /> Dinheiro
              </p>
            );
          case 'debit':
            return (
              <p className="text-sm items-center justify-center flex">
                <Debit className="inline-block mr-2" /> Débito
              </p>
            );
          case 'credit':
            return (
              <p className="text-sm items-center justify-center flex">
                <Credit className="inline-block mr-2" /> Crédito
              </p>
            );
          case 'pix':
            return (
              <p className="text-sm items-center justify-center flex">
                <Pix className="inline-block mr-2" /> Pix
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default Seller;
