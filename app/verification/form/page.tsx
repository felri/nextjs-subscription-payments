import FormFields from './FormFields';
import { getSeller } from '@/app/supabase-server';
import React, { Suspense } from 'react';

const VerificationPage: React.FC = async () => {
  const [seller] = await Promise.all([getSeller()]);

  return (
    <Suspense fallback={<div></div>}>
      <FormFields seller={seller} />
    </Suspense>
  );
};

export default VerificationPage;
