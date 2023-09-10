import VerificationImage from './VerificationSelfie';
import { getSession } from '@/app/supabase-server';
import React, { Suspense } from 'react';

const VerificationPage: React.FC = async () => {
  const [session] = await Promise.all([getSession()]);

  const user = session?.user;

  return (
    <Suspense fallback={<div></div>}>
      <VerificationImage userId={user?.id ?? ''} />
    </Suspense>
  );
};

export default VerificationPage;
