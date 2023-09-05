import Steps from './Steps';
import { getSeller } from '@/app/supabase-server';
import React, { useMemo } from 'react';

const DocumentVerification: React.FC = async () => {
  const seller = await getSeller();

  return (
    <div className="p-6 max-w-md mx-auto rounded-xl shadow-md ">
      <Steps seller={seller} />
    </div>
  );
};

export default DocumentVerification;
