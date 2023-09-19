'use client';

import { Database } from '@/types_db';
import { capitalizeFirstLetterAllWords, putData } from '@/utils/helpers';
import { getStorageDocumentsSupabaseUrl } from '@/utils/helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

interface CardProps {
  seller?: Database['public']['Tables']['sellers']['Row'];
}

const Card: React.FC<CardProps> = ({ seller }) => {
  const router = useRouter();

  const [reason, setReason] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onClick = () => {
    router.push(`/admin/verification/panel/${seller?.user_id}`);
  };

  const selfieUrl = getStorageDocumentsSupabaseUrl(
    seller?.verification_photo_url || '',
    seller?.user_id || ''
  );
  console.log(selfieUrl);
  const documentUrl = getStorageDocumentsSupabaseUrl(
    seller?.verification_document_url || '',
    seller?.user_id || ''
  );
  const videoUrl = getStorageDocumentsSupabaseUrl(
    seller?.verification_video_url || '',
    seller?.user_id || ''
  );

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await putData({
        url: '/api/verify-admin',
        data: { verification_status: 'verified', userId: seller?.user_id }
      });
      console.log(response);
      toast.success('Usuario verificado com sucesso!');
    } catch (error) {
      console.log(error);
      toast.error('Erro ao verificar usuario!');
    }
    setLoading(false);
  };

  const handleDeny = async () => {
    setLoading(true);
    try {
      const response = await putData({
        url: '/api/verify-admin',
        data: {
          verification_status: 'pending',
          verification_message: reason,
          userId: seller?.user_id
        }
      });
      console.log(response);
      toast.success('Negado com sucesso!');
    } catch (error) {
      console.log(error);
      toast.error('Erro ao negar usuario!');
    }
    setLoading(false);
  };

  const deleteMedia = async (name: string) => {
    setLoading(true);
    try {
      const response = await putData({
        url: '/api/verify-admin',
        data: { [name]: null, userId: seller?.user_id }
      });
      console.log(response);
      toast.success('Media deletada com sucesso!');
    } catch (error) {
      console.log(error);
      toast.error('Erro ao deletar media!');
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="bg-zinc-800 rounded-lg shadow-md cursor-pointer transition duration-300 hover:bg-zinc-900 active:bg-zinc-900">
        <div className="p-2" onClick={onClick}>
          <h2 className="text-white text-xl font-semibold mb-1 flex items-center">
            {capitalizeFirstLetterAllWords(seller?.full_name || '')}
          </h2>
          <h2 className="text-white text-xl font-semibold mb-1 flex items-center">
            CPF:{' '}
            {seller?.cpf?.replace(
              /(\d{3})(\d{3})(\d{3})(\d{2})/,
              '$1.$2.$3-$4'
            ) || ''}
          </h2>
          <h2 className="text-white text-xl font-semibold mb-1 flex items-center">
            Nascimento: {seller?.birthday || ''}
          </h2>
          <div className="flex text-ellipsis justify-center items-center flex-col mt-4">
            <p className="text-white font-semibold">DOCUMENTO</p>
            <button
              className="w-full bg-[#960044] p-2 mt-2 rounded-md text-white font-semibold m-4"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteMedia('verification_document_url');
              }}
            >
              {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
              Deletar
            </button>
            <Image
              src={documentUrl}
              alt={seller?.name || '' + ' - Documento'}
              width="0"
              height="0"
              sizes="100vw"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="flex text-ellipsis justify-center items-center flex-col mt-4">
            <p className="text-white font-semibold">SELFIE</p>
            <button
              className="w-full bg-[#960044] p-2 mt-2 rounded-md text-white font-semibold m-4"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteMedia('verification_photo_url');
              }}
            >
              {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
              Deletar
            </button>
            <Image
              src={selfieUrl}
              alt={seller?.name || ''}
              width="0"
              height="0"
              sizes="100vw"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="flex text-ellipsis justify-center items-center flex-col mt-4">
            <p className="text-white font-semibold">VIDEO</p>
            <button
              className="w-full bg-[#960044] p-2 rounded-md text-white font-semibold m-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteMedia('verification_video_url');
              }}
            >
              {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
              Deletar
            </button>
            <video
              className="w-full h-full"
              src={videoUrl}
              controls
              autoPlay
              muted
            ></video>
          </div>
          <div className="mt-4 p-4">
            <textarea
              className="w-full bg-zinc-700 p-2 rounded-md text-white font-semibold"
              placeholder="Motivo da reprovação"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex justify-center items-center mt-2">
              <button
                className="w-full bg-[#960044] p-2 mt-2 rounded-md text-white font-semibold mr-2"
                disabled={!reason}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeny();
                }}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Reprovar
              </button>
              <button
                className="w-full bg-green-700 p-2 mt-2 rounded-md text-white font-semibold ml-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleConfirm();
                }}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Aprovar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
