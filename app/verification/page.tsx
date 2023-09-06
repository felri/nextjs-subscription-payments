import Steps from './Steps';
import { getSeller } from '@/app/supabase-server';
import React, { Suspense } from 'react';

const DocumentVerification: React.FC = async () => {
  const seller = await getSeller();

  return (
    <div className="p-6 max-w-md mx-auto rounded-xl shadow-md ">
      <Suspense fallback={<div>Loading...</div>}>
        <Steps seller={seller} />
      </Suspense>
    </div>
  );
};

export default DocumentVerification;
