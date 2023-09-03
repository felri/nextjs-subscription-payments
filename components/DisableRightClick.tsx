'use client';

import { useEffect } from 'react';

const DisableRightClick: React.FC = () => {
  useEffect(() => {
    // Check if environment is production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener('contextmenu', handleRightClick);

    return () => {
      window.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return null; // This component does not render anything
};

export default DisableRightClick;
