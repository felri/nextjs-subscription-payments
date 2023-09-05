'use client';

import s from './Navbar.module.css';
import SignOutButton from './SignOutButton';
import { useSupabase } from '@/app/supabase-provider';
import Logo from '@/components/icons/Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default async function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { supabase } = useSupabase();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
    });
  }, []);

  return (
    <nav className={s.root}>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <nav className="hidden ml-6 space-x-2 lg:block"></nav>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            {user ? (
              pathname.includes('account') ? (
                <>
                  <Link href={`/profile/${user.id}`} className={s.link}>
                    Ver anúncio
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <Link href="/account" className={s.link}>
                  Minha conta
                </Link>
              )
            ) : (
              <Link href="/signin" className={s.link}>
                + Criar anúncio grátis
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
