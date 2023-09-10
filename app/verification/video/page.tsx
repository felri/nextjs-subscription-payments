import VerificationVideo from './VerificationVideo';
import { getSession } from '@/app/supabase-server';
import React, { Suspense } from 'react';

const VerificationPage: React.FC = async () => {
  const [session] = await Promise.all([getSession()]);

  const user = session?.user;

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerificationVideo
        code={user?.id.split('-')[3] ?? ''}
        userId={user?.id ?? ''}
      />
    </Suspense>
  );
};

export default VerificationPage;
