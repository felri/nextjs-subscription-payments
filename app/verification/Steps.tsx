'use client';

import { Database } from '@/types_db';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';

interface StepsProps {
  seller: Database['public']['Tables']['sellers']['Row'];
}

const Steps: React.FC<StepsProps> = ({ seller }) => {
  const router = useRouter();
  const {
    cpf,
    verification_status,
    verification_video_url,
    verification_photo_url,
    verification_document_url
  } = seller;
  const steps = useMemo(() => {
    return [
      {
        title: 'Complete seus dados básicos',
        status: cpf && verification_document_url ? 'Completo' : 'Pendente',
        completed: !!cpf && !!verification_document_url,
        path: '/verification/document'
      },
      {
        title: 'Autenticação facial',
        status: verification_photo_url ? 'Completo' : 'Pendente',
        completed: !!verification_photo_url,
        path: '/verification/picture',
        disabled: !verification_document_url || !cpf
      },
      {
        title: 'Envie sua mídia de comparação',
        status: verification_video_url ? 'Completo' : 'Pendente',
        completed: !!verification_document_url,
        path: '/verification/video',
        disabled: !verification_photo_url
      }
    ];
  }, [cpf, verification_document_url, verification_photo_url]);

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
            className={`relative flex items-center justify-start p-4 bg-zinc-800 border rounded-lg cursor-pointer w-full text-left 
              ${step.disabled ? 'opacity-50' : 'hover:bg-zinc-700'}
            `}
            onClick={() => router.push(step.path)}
            disabled={step.disabled}
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
        {!!verification_document_url &&
          !!verification_photo_url &&
          !!verification_video_url && (
            <>
              <div className="flex items-center justify-center p-4 bg-zinc-800 border border-yellow-400 rounded-lg cursor-pointer w-full text-left">
                Documentos em análise
              </div>
              <p className="text-sm text-gray-300 text-center">
                A análise dos documentos pode levar até 24 horas, <br />
                em breve você receberá um e-mail com o resultado
              </p>
            </>
          )}
      </div>
    </div>
  );
};

export default Steps;
