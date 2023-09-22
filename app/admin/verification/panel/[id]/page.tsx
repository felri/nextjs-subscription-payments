import VerificationDetails from './VerificationDetails';
import { getSellerProfile } from '@/app/supabase-server';
import LoadingDots from '@/components/ui/LoadingDots';
import React, { Suspense } from 'react';

interface VerificationPanelProps {
  params: {
    id: string;
  };
}

const VerificationPanel = async ({ params }: VerificationPanelProps) => {
  const seller = await getSellerProfile(params.id);
  return (
    <div className="mx-auto max-w-2xl">
      <Suspense
        fallback={
          <div className="w-full h-16 flex justify-center items-center">
            <LoadingDots />
          </div>
        }
      >
        <VerificationDetails seller={seller} />
      </Suspense>
    </div>
  );
};

export default VerificationPanel;
