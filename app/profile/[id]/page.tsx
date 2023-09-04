import Seller from './Seller';
import { getSellerProfile, getAllServiceTags } from '@/app/supabase-server';
import { Database } from '@/types_db';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

export default async function SearchBarPage({
  params
}: {
  params: { id: string };
}) {
  let seller: Database['public']['Tables']['sellers']['Row'] | null = null;
  let tags:
    | Database['public']['Tables']['seller_services_tags']['Row'][]
    | null = null;
  const userId = params.id;

  if (userId) {
    seller = await getSellerProfile(userId);
    tags = await getAllServiceTags();
    if (!seller) {
      redirect('/404');
    }
  } else {
    redirect('/404');
  }

  return (
    <div className="min-h-screen py-2 w-full max-w-screen-sm mx-auto">
      <Seller seller={seller} media={seller?.media} tags={tags} />
    </div>
  );
}
