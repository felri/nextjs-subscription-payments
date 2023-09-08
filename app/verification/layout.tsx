import { getSession } from '@/app/supabase-server';
import { redirect } from 'next/navigation';

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const [session] = await Promise.all([getSession()]);

  if (!session) {
    return redirect('/signin');
  }

  return <main>{children}</main>;
}
