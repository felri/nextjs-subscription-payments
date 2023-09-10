import List from './List';
import { getVerificationPendingSellers } from '@/app/supabase-server';
import React, { Suspense } from 'react';

const VerificationPanel: React.FC = async () => {
  const sellers = await getVerificationPendingSellers();
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <List sellers={sellers} />
      </Suspense>
    </div>
  );
};

export default VerificationPanel;
