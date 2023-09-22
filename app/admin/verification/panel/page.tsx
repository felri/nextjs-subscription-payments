import List from './List';
import { getVerificationPendingSellers } from '@/app/supabase-server';
import LoadingDots from '@/components/ui/LoadingDots';
import React, { Suspense } from 'react';

const VerificationPanel: React.FC = async () => {
  const sellers = await getVerificationPendingSellers();
  return (
    <div>
      <Suspense
        fallback={
          <div className="w-full h-16 flex justify-center items-center">
            <LoadingDots />
          </div>
        }
      >
        <List sellers={sellers} />
      </Suspense>
    </div>
  );
};

export default VerificationPanel;
