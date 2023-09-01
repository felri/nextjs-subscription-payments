import AuthUI from './AuthUI';
import { getSession } from '@/app/supabase-server';
import Logo from '@/components/icons/Logo';
import { redirect } from 'next/navigation';

export default async function SignIn() {
  const session = await getSession();

  if (session) {
    return redirect('/account');
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 flex-col items-center">
          <Logo width="64px" height="64px" />
          <p className="text-red-200 text-3xl font-semibold my-0">
            Primabela
          </p>
        </div>
        <AuthUI />
      </div>
    </div>
  );
}
