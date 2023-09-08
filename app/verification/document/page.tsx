import VerificationDocument from './VerificationDocument';
import { getSession, getSeller } from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

const VerificationPage: React.FC = async () => {
  return (
    <Suspense fallback={<div></div>}>
      <VerificationDocument />
    </Suspense>
  );
};

export default VerificationPage;
