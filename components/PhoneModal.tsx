import { formatPhonenumberBR } from '@/utils/helpers';
import React, { useState } from 'react';

const PhoneModal: React.FC<{
  isOpen: boolean;
  onWhatsapp: () => void;
  onCancel: () => void;
  onCopy: () => void;
  phone: string;
}> = ({ isOpen, onWhatsapp, onCancel, onCopy, phone }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-black p-4 max-w-md w-full rounded-md shadow-lg relative z-20 flex flex-col">
        <div className="text-center mb-4 text-gray-200 text-lg font-bold">
          {formatPhonenumberBR(phone || '')}
        </div>
        <div className="mt-4 flex justify-between flex-col space-y-4">
          <button
            onClick={onWhatsapp}
            className="bg-green-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Abrir no Whatsapp
          </button>
          <button
            onClick={onCopy}
            className="bg-gray-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Copiar número
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Fechar
          </button>
        </div>
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"
        onClick={onCancel}
      ></div>
    </div>
  );
};

export default PhoneModal;
