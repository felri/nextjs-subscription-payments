import { formatPhonenumberBR } from '@/utils/helpers';
import React, { useState } from 'react';
import { AiFillCopy, AiOutlineCloseCircle } from 'react-icons/ai';
import { IoLogoWhatsapp } from 'react-icons/io5';

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
        <div className="mt-4 flex justify-center items-center space-x-4">
          <button
            onClick={onCopy}
            className="bg-gray-500 text-white p-2 rounded-full w-16 h-16"
          >
            <AiFillCopy className="inline-block text-4xl" />
          </button>
          <button
            onClick={onWhatsapp}
            className="bg-green-500 text-white p-2 rounded-full w-16 h-16"
          >
            <IoLogoWhatsapp className="inline-block text-4xl" />
          </button>

          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-gray-600 text-white p-1 rounded-full absolute -top-8 right-0"
          >
            <AiOutlineCloseCircle className="inline-block text-4xl" />
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
