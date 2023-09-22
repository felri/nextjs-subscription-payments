'use client';

import { Database } from '@/types_db';
import Link from 'next/link';
import React, { useMemo } from 'react';

interface StatusVerificationProps {
  seller: Database['public']['Tables']['sellers']['Row'];
}

const StatusVerification: React.FC<StatusVerificationProps> = ({ seller }) => {
  if (!seller.active) {
    return null;
  }


  return (
    <div className="bg-zinc-800 p-3 rounded-md mt-4 max-w-sm mx-auto">
      {seller.verification_status === 'verified' ? (
        <div className="flex items-center">
          {/* little green ball */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 inline-block mr-1 text-green-500"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="5" />
          </svg>
          <p>Verificação completa</p>
        </div>
      ) : (
        <div>
          <>
            <div className="flex items-center">
              {/* little green ball */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline-block mr-1 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="5" />
              </svg>
              <p>
                Verificação{' '}
                <span className="text-xs ml-1 text-gray-300">(opcional)</span>
              </p>
            </div>
            <p className="text-xs m-1 text-gray-300 mt-2 mb-4">
              A verificação é opcional, mas recomendada para aumentar a
              confiança dos clientes.
            </p>

            <div className="w-full flex justify-center">
              <Link
                href="/verification/"
                className="p-2 bg-zinc-900 border border-zinc-500 text-gray-300 text-center w-full rounded-md mx-auto"
              >
                Verificar
              </Link>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default StatusVerification;
