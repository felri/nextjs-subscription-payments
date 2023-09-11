import Steps from './Steps';
import React, { Suspense } from 'react';

const DocumentVerification: React.FC = async () => {
  return (
    <div className="p-6 max-w-md mx-auto rounded-xl shadow-md ">
      <Steps />
    </div>
  );
};

export default DocumentVerification;
