'use client';

import { useInputMask } from '@code-forge/react-input-mask';
import React from 'react';

interface InputProps {
  value: string;
  className?: string;
  mask: string;
  placeholder: string;
  type?: string;
  name?: string;
}

export const MaskedInput: React.FC<InputProps> = ({
  value,
  className,
  mask,
  placeholder,
  type = 'text',
  name
}) => {
  const { getInputProps } = useInputMask({ mask, value });

  return (
    <input
      type={type}
      name={name}
      className={className}
      placeholder={placeholder}
      {...getInputProps()}
      readOnly
    />
  );
};
