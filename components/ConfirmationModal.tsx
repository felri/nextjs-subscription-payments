import React, { useState } from 'react';

const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-black p-4 max-w-md w-full rounded-md shadow-lg relative z-20 flex flex-col">
        <div className="text-center mb-4 text-gray-200">
          Você tem certeza que desejea <br />
          realizar esta ação?
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Confirmar
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

export default ConfirmationModal;
