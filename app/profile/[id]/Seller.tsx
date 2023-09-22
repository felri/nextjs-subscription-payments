'use client';

import ImagesPopup from './ImagesPopup';
import VideoPlayer from './VideoPlayer';
import PhoneModal from '@/components/PhoneModal';
import TagsSelector from '@/components/TagsSelector';
import { Debit, Credit, Cash, Pix } from '@/components/icons/Payments';
import { Database } from '@/types_db';
import {
  formatCurrencyToBrl,
  getStorageSupabaseUrl,
  capitalizeFirstLetterAllWords,
  getEthinicity,
  getSexualOrientation,
  openWhatsapp,
  getStorageSupabaseUrlThumbnail
} from '@/utils/helpers';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { AiOutlineInstagram } from 'react-icons/ai';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BsTelegram } from 'react-icons/bs';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';
import { SiOnlyfans } from 'react-icons/si';
import { toast } from 'react-toastify';

interface SellerProps {
  seller?: Database['public']['Tables']['sellers']['Row'];
  media?: Database['public']['Tables']['media']['Row'][];
  tags?: Database['public']['Tables']['seller_services_tags']['Row'][];
}

const Seller: React.FC<SellerProps> = ({ seller, media, tags }) => {
  const [showPhone, setShowPhone] = React.useState(false);
  const filteredTags = tags?.filter((tag) =>
    seller?.service_tags?.includes(tag.slug || '')
  );

  const getAvatarUrl = () => {
    if (seller?.featured_image_url) {
      return getStorageSupabaseUrl(seller?.featured_image_url, seller?.user_id);
    } else if (media && media?.length > 0) {
      return getStorageSupabaseUrl(
        media?.[0]?.media_url || '',
        seller?.user_id || ''
      );
    } else {
      return '/images/avatar.png';
    }
  };

  const handleShowPhone = () => {
    setShowPhone(true);
  };

  const handleClosePhone = () => {
    setShowPhone(false);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(seller?.phone || '');
    setShowPhone(false);
    toast.success('Copiado para a área de transferência');
  };

  const onShare = () => {
    // check if the web share api is supported
    if (!navigator.share) {
      const profileUrl = `https://primabela.lol/profile/${seller?.user_id}`;
      navigator.clipboard.writeText(profileUrl);
      toast.success('Copiado para a área de transferência');
    } else {
      navigator.share({
        title: 'Acompanhantes',
        text: `Acompanhante ${seller?.name} - ${seller?.phone}`,
        url: `https://primabela.lol/profile/${seller?.user_id}`
      });
    }

    setShowPhone(false);
  };

  const openTelegram = () => {
    window.open(`https://t.me/${seller?.telegram}`, '_blank');
  };

  const openInstagram = () => {
    window.open(`https://instagram.com/${seller?.instagram}`, '_blank');
  };

  const openOnlyfans = () => {
    window.open(`https://onlyfans.com/${seller?.onlyfans}`, '_blank');
  };

  const openPrivacy = () => {
    window.open(`https://privacy.com.br/Checkout/${seller?.privacy}`, '_blank');
  };

  return (
    <div className="w-full p-2 pt-0">
      <PhoneModal
        isOpen={showPhone}
        onWhatsapp={() => {
          setShowPhone(false);
          openWhatsapp(seller?.name || '', seller?.phone || '');
        }}
        onCancel={() => setShowPhone(false)}
        onCopy={onCopy}
        onShare={onShare}
        phone={seller?.phone || ''}
      />
      <div className="flex justify-center items-center w-full mb-6 relative max-w-md mx-auto">
        <div>
          <AvatarPicture
            verified={seller?.verification_status === 'verified'}
            image={getAvatarUrl()}
          />
          <div className="flex w-full items-center justify-end mt-4 absolute bottom-0 pr-3">
            {seller?.telegram && seller?.telegram !== '' && (
              <div
                onClick={openTelegram}
                className="bg-[#229ED9] rounded-md p-2 cursor-pointer m-1"
              >
                <BsTelegram className="text-white text-4xl" />
              </div>
            )}
            {seller?.instagram && seller?.instagram !== '' && (
              <div
                className="instagram rounded-md p-2 cursor-pointer m-1"
                onClick={openInstagram}
              >
                <AiOutlineInstagram className="text-white text-4xl" />
              </div>
            )}
            {seller?.onlyfans && (
              <div
                className="bg-[#00AFF0] rounded-md p-2 cursor-pointer m-1"
                onClick={openOnlyfans}
              >
                <SiOnlyfans className="text-white text-4xl" />
              </div>
            )}
            {seller?.privacy && (
              <div
                className="bg-orange-500 rounded-md p-2 cursor-pointer m-1"
                onClick={openPrivacy}
              >
                <SiOnlyfans className="text-white text-4xl" />
              </div>
            )}
            <div
              onClick={handleShowPhone}
              className="bg-[#2BB741] rounded-md p-2 cursor-pointer  m-1 "
            >
              <IoLogoWhatsapp className="text-white text-4xl" />
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-zinc-800 rounded-lg shadow-md border border-zinc-600"
        aria-disabled="true"
      >
        <div>
          <div className="bg-zinc-600 p-3">
            <h2 className="text-white text-lg font-semibold mb-1 flex items-center truncate">
              {capitalizeFirstLetterAllWords(seller?.name || '')}
              {seller?.verification_status === 'verified' && (
                <>
                  <div className="rounded-full z-10 flex items-start justify-start mx-2">
                    <MdVerified className="text-green-600 text-2xl" />
                  </div>
                  <div className="text-xs text-gray-300 ">
                    Perfil verificado
                  </div>
                </>
              )}
            </h2>
          </div>
          <div className="text-white text-sm mb-2 bg-zinc-700 p-2 truncate">
            {seller?.short_description}
          </div>
          <div className="p-3">
            <div className="flex justify-center items-center flex-col">
              <div className="w-full flex">
                <div className="w-1/2">
                  <div className="text-sm text-green-300 font-semibold">
                    {seller?.hourly_rate &&
                      formatCurrencyToBrl(seller?.hourly_rate || 0) + '/h'}
                  </div>

                  {seller?.age && (
                    <div className="text-sm">{seller?.age} anos</div>
                  )}
                  {seller?.current_height && (
                    <div className="text-sm">{seller?.current_height} cm</div>
                  )}
                  {seller?.current_weight && (
                    <div className="text-sm">{seller?.current_weight} kg</div>
                  )}
                  {seller?.shoe_size && (
                    <div className="text-sm">Pés {seller?.shoe_size} </div>
                  )}
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
                    {getEthinicity(seller?.ethnicity)}
                  </div>
                  <div className="text-sm">
                    {getSexualOrientation(seller?.sexual_orientation)}
                  </div>
                </div>
              </div>
              {/* payment methods */}
              <div className="text-sm font-semibold mb-2 mt-4">
                {seller?.neighborhood} - {seller?.cities?.name}
              </div>
              <AcceptedPayments
                paymentMethods={seller?.payment_methods || []}
              />
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

const ImageList = ({
  media,
  userId
}: {
  media: Database['public']['Tables']['media']['Row'][];
  userId: string;
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleShowModal = (index: number) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  return (
    <div className="flex flex-wrap">
      {media.map((item, index) => (
        <div
          key={item.media_id}
          className="w-1/3 p-1 relative"
          onClick={() => handleShowModal(index)}
        >
          <div className="bg-zinc-800 rounded shadow-md overflow-hidden">
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
                src={getStorageSupabaseUrlThumbnail(
                  item.media_url || '',
                  userId
                )}
                alt="Media"
                width="0"
                height="0"
                sizes="100vw"
                className="aspect-square object-cover"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
            {/* <DateLabel createdAt={item.created_at} /> */}
          </div>
        </div>
      ))}
      {showModal && (
        <ImagesPopup
          media={media}
          userId={userId}
          selectedIndex={selectedIndex}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

const AvatarPicture: React.FC<{ image?: string; verified?: boolean }> = ({
  image,
  verified
}) => {
  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="w-80 h-80 rounded-full border-4 border-pink-900 overflow-hidden">
        <Image
          width={240}
          height={240}
          src={image || '/images/avatar.png'}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      {verified && (
        <div className="absolute bottom-0 left-0 rounded-full p-1 cursor-pointer z-10 flex items-start justify-start bg-white">
          <MdVerified className="text-green-600 text-5xl" />
        </div>
      )}
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
                <Cash className="inline-block mr-2" /> Dinheiro
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
