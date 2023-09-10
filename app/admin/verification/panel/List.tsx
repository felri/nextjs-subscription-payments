'use client';

import { Database } from '@/types_db';
import { postData } from '@/utils/helpers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const List = ({
  sellers
}: {
  sellers: Database['public']['Tables']['sellers']['Row'][];
}) => {
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState(false);

  const checkPassword = async (password: string) => {
    try {
      const response = await postData({
        url: '/api/verify-admin',
        data: { password }
      });

      if (!response.verified) {
        // If the password is not valid, redirect to another page or show an error message
        alert('Invalid password');
        router.push('/');
      }

      setAuthenticated(true);
    } catch (error) {
      console.log(error);
      alert('Invalid password');
      router.push('/');
    }
  };

  useEffect(() => {
    const password = prompt('Enter password');
    if (password) {
      checkPassword(password);
    } else {
      router.push('/');
    }
  }, []);

  if (!authenticated) {
    return <div>Authenticating...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto rounded-xl shadow-md ">
      {sellers.map((seller) => (
        <div
          className="p-4 rounded-md shadow-md max-w-md mx-auto mt-4 text-center border border-gray-200 decoration-none"
          key={seller.user_id}
        >
          <Link
            target="_blank"
            href={`/admin/verification/panel/${seller.user_id}`}
          >
            <h2 className="text-xl font-bold mb-2 text-center">
              {seller.name}
            </h2>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default List;
