import LoadingDots from '@/components/ui/LoadingDots';
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  children: ReactNode;
  loading?: boolean;
}

const GenericModal: React.FC<ModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  confirmText,
  children,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-black p-4 max-w-md w-full max-h-[calc(100%-120px)] overflow-y-auto rounded-md shadow-lg relative z-20 flex flex-col bg-opacity-80">
        <div className="text-center mb-4 text-gray-200">{children}</div>
        <div className="mt-4 flex justify-center">
          {onCancel && (
            <button
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
          )}
          {onConfirm && (
            <button
              disabled={loading}
              onClick={onConfirm}
              className="bg-green-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              {loading ? <LoadingDots /> : confirmText || 'Confirmar'}
            </button>
          )}
        </div>
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"
        onClick={onCancel}
      ></div>
    </div>
  );
};

export default GenericModal;
