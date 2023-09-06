import VerificationVideo from './VerificationVideo';
import { getSession, getSeller } from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

const VerificationPage: React.FC = async () => {
  const [session, seller] = await Promise.all([getSession(), getSeller()]);
  const user = session?.user;

  if (!session) {
    return redirect('/signin');
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerificationVideo />
    </Suspense>
  );
};

export default VerificationPage;
