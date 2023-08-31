import Seller from './Seller';
import { getSellerProfile } from '@/app/supabase-server';
import { Database } from '@/types_db';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

export default async function SearchBarPage({
  params
}: {
  params: { id: string };
}) {
  let seller: Database['public']['Tables']['sellers']['Row'] | null = null;
  const userId = params.id;

  if (userId) {
    seller = await getSellerProfile(userId);
    if (!seller) {
      redirect('/404');
    }
  } else {
    redirect('/404');
  }

  return (
    <div className="min-h-screen py-2 w-full max-w-screen-md mx-auto">
      <Seller seller={seller} media={seller?.media} />
    </div>
  );
}