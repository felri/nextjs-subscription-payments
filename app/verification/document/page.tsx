import VerificationDocument from './VerificationDocument';
import React, { Suspense } from 'react';

const VerificationPage: React.FC = async () => {
  return (
    <Suspense fallback={<div></div>}>
      <VerificationDocument />
    </Suspense>
  );
};

export default VerificationPage;
