'use client';

import { Database } from '@/types_db';
import { getData } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';

const Steps: React.FC = () => {
  const router = useRouter();
  const [seller, setSeller] = React.useState<
    Database['public']['Tables']['sellers']['Row'] | null
  >(null);

  const fetchSeller = async () => {
    const response = await getData({
      url: '/api/seller'
    });
    console.log('response', response);
    setSeller(response);
  };

  useEffect(() => {
    fetchSeller();
  }, []);

  const steps = useMemo(() => {
    if (!seller) return [];

    return [
      {
        title: 'Complete seus dados básicos',
        status:
          seller.cpf && seller.verification_document_url
            ? 'Completo'
            : 'Pendente',
        completed: !!seller.cpf && !!seller.verification_document_url,
        path: '/verification/form'
      },
      {
        title: 'Autenticação facial',
        status: seller.verification_photo_url ? 'Completo' : 'Pendente',
        completed: !!seller.verification_photo_url,
        path: '/verification/picture'
      },
      {
        title: 'Envie sua mídia de comparação',
        status: seller.verification_video_url ? 'Completo' : 'Pendente',
        completed: !!seller.verification_document_url,
        path: '/verification/video'
      }
    ];
  }, [seller]);

  const status = useMemo(() => {
    const completedSteps = steps.filter((step) => step.status === 'completed');
    return completedSteps.length / steps.length;
  }, [steps]);

  return (
    <div className="p-2 max-w-md mx-auto rounded-xl shadow-md ">
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl mb-4">
          Verificação de documentos
        </h1>
        <p>
          Complete os passos abaixo para ter seus documentos verificados na
          plataforma
        </p>
      </div>

      <div className="space-y-4 truncate">
        {steps.map((step, index) => (
          <button
            key={index}
            className={`relative flex items-center justify-start p-4 bg-black border rounded-lg cursor-pointer w-full text-left 
              ${step.completed ? 'opacity-50' : 'hover:bg-zinc-700'}
            `}
            onClick={() => router.push(step.path)}
            disabled={step.completed || step.completed}
          >
            <div className="text-xl font-bold mr-4">{index + 1}</div>
            <div className="flex-grow">
              <div className="text-lg mb-1">{step.title}</div>
              <div
                className={`text-sm ${
                  step.completed ? 'text-green-500' : 'text-gray-300'
                }`}
              >
                <span>{step.status}</span>
              </div>
            </div>
            <div className="ml-4 text-gray-300 absolute right-2 text-md">
              <AiOutlineArrowRight />
            </div>
          </button>
        ))}
        {seller?.verification_message && seller?.verification_message !== '' ? (
          <div className="p-2 box-border">
            <div className="flex items-center justify-center p-4 bg-black border border-red-400 rounded-lg cursor-pointer w-full text-left">
              Documentos não aprovados
            </div>

            <p className="text-sm text-white text-center text-ellipsis mt-4">
              Mensagem do sistema:
            </p>

            <p className="text-sm text-red-400 text-center text-ellipsis mt-4">
              {seller?.verification_message}
            </p>
          </div>
        ) : (
          !!seller?.verification_document_url &&
          !!seller?.verification_photo_url &&
          !!seller?.verification_video_url && (
            <div className="p-2 box-border">
              <div className="flex items-center justify-center p-4 bg-black border border-yellow-400 rounded-lg cursor-pointer w-full text-left">
                Documentos em análise
              </div>

              <p className="text-sm text-gray-300 text-center text-ellipsis mt-4">
                A análise pode levar até 24 horas,
                <br /> em breve você receberá um e-mail com o resultado
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Steps;
