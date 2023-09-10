import VerificationDetails from './VerificationDetails';
import { getSellerProfile } from '@/app/supabase-server';
import React, { Suspense } from 'react';

interface VerificationPanelProps {
  params: {
    id: string;
  };
}

const VerificationPanel = async ({ params }: VerificationPanelProps) => {
  const seller = await getSellerProfile(params.id);
  return (
    <div className='mx-auto max-w-2xl'>
      <Suspense fallback={<div>Loading...</div>}>
        <VerificationDetails seller={seller} />
      </Suspense>
    </div>
  );
};

export default VerificationPanel;
