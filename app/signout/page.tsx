'use client';

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignOut() {
  const router = useRouter();
  const { supabase } = useSupabase();

  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
      router.push('/signin');
    }
    signOut();
  }, []);

  return <div />;
}
